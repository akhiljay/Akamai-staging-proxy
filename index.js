//  Install npm dependencies first
//  npm init
//  npm install --save url@0.10.3
//  npm install --save http-proxy@1.11.1

var httpProxy = require("http-proxy");
var http = require("http");
var url = require("url");
var net = require('net');
var loki = require('lokijs');

var db = new loki('hostmap.json');
var children = db.addCollection('clients')
children.insert({host:'www.tripadvisor.com', stagingserver: 'www.tripadvisor.com.edgekey-staging.net'})
children.insert({host:'static.tacdn.com', stagingserver: 'static.tacdn.com.edgekey-staging.net'})
children.insert({host:'media-cdn.tripadvisor.com', stagingserver: 'media.tacdn.com.edgekey-staging.net'})
//children.insert({host:'www.akamaidevops.com', stagingserver: 'test.edgekey-staging.net'})


var getHostPortFromString = function (hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;
  
    var result = regex_hostport.exec(hostString);
    if (result != null) {
      host = result[1];
      if (result[2] != null) {
        port = result[3];
      }
    }
  
    return ( [host, port] );
  };
  

var server = http.createServer(function (req, res) {

  var urlObj = url.parse(req.url);
  var hostPort = getHostPortFromString(req.url, 80);
  var stagingdomain = children.findOne( {host:urlObj.host} ) ;
  if (stagingdomain != null){
      console.log("not null");
      console.log(stagingdomain);
      var target1 = stagingdomain.stagingserver;
  }
  else {
      console.log("is null");
      console.log(stagingdomain);
      var target1 = hostPort[0];
  }


  //var target = urlObj.protocol + "//" + target1;
  var target = target1;
  console.log("Proxy HTTP request for:", target1);
  var proxy = httpProxy.createProxyServer({});
  proxy.on("error", function (err, req, res) {
    console.log("proxy error", err);
    res.end();
  });
  proxy.web(req, res, {target: target});


}).listen(443);  //this is the port your clients will connect to


var regex_hostport = /^([^:]+)(:([0-9]+))?$/;




server.addListener('connect', function (req, socket, bodyhead) {
    var StagingHost = req.headers;
    console.log(StagingHost);
    var hostPort = getHostPortFromString(req.url, 443);
    var stagingdomain = children.findOne( {host:hostPort[0]} ) ;
    if (stagingdomain != null){
        console.log("not null");
        console.log(stagingdomain);
        var hostDomain = stagingdomain.stagingserver;
    }
    else {
        console.log("is null");
        console.log(stagingdomain);
        var hostDomain = hostPort[0];
    }
    var port = parseInt(hostPort[1]);
    console.log("Proxying HTTPS request for:", hostDomain, port);
    var proxySocket = new net.Socket();
    proxySocket.connect(port, hostDomain, function () {
        proxySocket.write(bodyhead);
        socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
      }
    );
    proxySocket.on('data', function (chunk) {
        socket.write(chunk);
      });
    
      proxySocket.on('end', function () {
        socket.end();
      });
    
      proxySocket.on('error', function () {
        socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
        socket.end();
      });
    
      socket.on('data', function (chunk) {
        proxySocket.write(chunk);
      });
    
      socket.on('end', function () {
        proxySocket.end();
      });
    
      socket.on('error', function () {
        proxySocket.end();
      });


});