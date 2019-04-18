#! /usr/local/bin/node

var httpProxy = require("http-proxy");
var http = require("http");
var url = require("url");
var net = require('net');
var loki = require('lokijs');
const bodyParser = require('body-parser');


// create application/json parser
var jsonParser = bodyParser.json()


var db = new loki('hostmap.db');
var children = db.addCollection('clients',{indices:['host']},{disableChangesApi:false})


var regex_hostport = /^([^:]+)(:([0-9]+))?$/;
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

//if a request comes in for insert then add it to loki db 
if  (req.url == '/api-staging/insert') {
    //console.log("matched on path");
if (req.method == 'POST'){
    //console.log("matched on POST");
    var body = "";
    req.on("data", function (chunk) {
        body += chunk;
        //console.log("chunk" + body);
    });

    req.on("end", function(){
        if (body != null){
          var parsed = JSON.parse(body);
          insertintoloki(parsed);
          //console.log("completed1" + parsed.hosts);
          res.writeHead(200, {'Content-Type': 'text/html'})
          res.end('Field inserted')
        } 
    });
}
else {
  console.log ("didn't match on POST");
}
}

//logic for proxying http requests starts here
else{
    var urlObj = url.parse(req.url);
    var hostPort = getHostPortFromString(req.url, 80);
    var stagingdomain = children.findOne( {host:urlObj.host} ) ;
    if (stagingdomain != null){
        console.log("not null");
        console.log("sd"+stagingdomain.stagingserver);
        console.log("sp"+stagingdomain.stagingport);
        var target2 = stagingdomain.stagingserver;
        if (stagingdomain.sandboxport != null){
          var targetport = stagingdomain.sandboxport;
          var target1 = "http://" + target2 + ":" + targetport;
        }
        else {
          var target1 = "http://" + target2;
        }
    }
    else {
        console.log("is null");
        var target1 = hostPort[0];
        //console.log("is nullhost" + target1);
    }
   
    var target = target1;
    console.log("Proxy HTTP request for:", target);
    var proxy = httpProxy.createProxyServer({});
    proxy.on("error", function (err, req, res) {
      console.log("proxy error", err);
      res.end();
    });
    proxy.web(req, res, {target: target});
  
}

}).listen(5050, () => {
  console.log ("--> Akamai-staging-proxy is now running on 127.0.0.1:5050");
  console.log("--> *you may now use the Akamai-staging-proxy chrome extension to route requests to Akamai's staging network")
});  //this is the port your clients will connect to

//proxying for https requests starts here
server.addListener('connect', function (req, socket, bodyhead) {
    var StagingHost = req.headers;
    //console.log(StagingHost);
    //enter logic to check if loki has a port redefined
    var hostPort = getHostPortFromString(req.url, 443);
    var stagingdomain = children.findOne( {host:hostPort[0]} ) ;

    //console.log("lokiDB"+stagingdomain);
    if (stagingdomain != null){
        //console.log("not null");
        //console.log(stagingdomain);
        var hostDomain = stagingdomain.stagingserver;
        if (stagingdomain.sandboxport != null){
          var port = stagingdomain.sandboxport;
        }
        else {
           port = parseInt(hostPort[1]);
        }
    }
    else {
        //console.log("is null");
        //console.log(stagingdomain);
        var hostDomain = hostPort[0];
        port = parseInt(hostPort[1]);
    }
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

var insertintoloki = function(object_body){
  //insert the values into LokiDB
  //console.log("inserloki"+ object_body.hosts);
  for (var i in object_body.hosts){
   //console.log("JSON NODe"+i);
    var apiinserthost = object_body.hosts[i].apihost;
    var apiinsertserver = object_body.hosts[i].apiserver;
    var apiinsertserverport = object_body.hosts[i].apiport;
    //console.log("apiinserthost" + apiinserthost);
   //console.log("apiinsertserver" +apiinsertserver);
    children.insert({host:apiinserthost, stagingserver: apiinsertserver, sandboxport: apiinsertserverport});
  }
  //console.log(db.serializeChanges(['clients']));

};

