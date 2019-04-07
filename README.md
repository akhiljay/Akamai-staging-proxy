# Akamai-staging-proxy
A Node based http(s) proxy that can be configured to point to Akamai staging environments without overiding the host file of your machine

Maintained by Akhil Jayaprakash @ Akamai Technologies [Twitter](https://twitter.com/akhiljp_dev)


## Step 1: Install the "Akamai-staging-proxy" server locally 

#### 1.1: Clone this repo locally
````
git clone https://github.com/akhiljay/Akamai-staging-proxy.git
````
> Navigate to the folder
````
cd Akamai-staging-proxy
````

#### 1.2: Install all dependencies based on package.json
````
npm install
````
#### 1.3: Run Node server
````
node index.js
````
> The server is now running on localhost:80

## Step 2: Install Google Example Chrome Proxy Extension
This extension helps you securely send traffic over to the node server running locally. This combination allows for both HTTP and HTTPS traffic

#### 2.1 Click [here](https://developer.chrome.com/extensions/examples/extensions/proxy_configuration.zip ) to download the chrome extension code
Unzip the file to a location in your laptop

#### 2.2 Install the extension in Chrome
2.2.1 Visit "chrome://extensions" and enable developer mode (it's a switch on the right hand corner of the page)

2.2.2 Click on "Load Unpacked" and select the folder of the unpacked zip file

> The Chrome extension is now installed in your browser

## Step 3: Configure the "Akamai-staging-proxy" server with your Akamai staging enviornment settings

The server accepts a JSON input to the path '/api-staging/insert'. The node server will only route the hostnames you mentioned in your JSON input to the required destination, the rest of the hostnames that goes via the server will be set to pass through mode. The JSON input has the following format
```json
{"hosts":
  [ 
    {"apihost":"www.akamaidevops.com","apiserver":"www.akamaidevops.coing.net"},
    {"apihost":"developer.akamai.com","apiserver":"san-developer.akamai.com.edgekey-staging.net."}
  ]
}
```
Here is the curl command you can run after replacing the values of your interest
````
curl -d '{"hosts":[ {"apihost":"www.akamaidevops.com","apiserver":"www.akamaidevops.coing.net"},{"apihost":"developer.akamai.com","apiserver":"san-developer.akamai.com.edgekey-staging.net."},{"apihost":"static.tacdn.com","apiserver":"static.tacdn.com.edgekey-staging.net"}]}' -H "Content-Type: application/json" -v -X POST http://127.0.0.1:80/api-staging/insert
````
If the server is configured correctly you will get a 200 OK with the response "Field inserted"
````
>*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to 127.0.0.1 port 80 (#0)
> POST /api-staging/insert HTTP/1.1
> Host: 127.0.0.1
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 362
>
* upload completely sent off: 362 out of 362 bytes
< HTTP/1.1 200 OK
< Content-Type: text/html
< Date: Sun, 07 Apr 2019 01:29:19 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host 127.0.0.1 left intact
Field inserted
````

## Step 4: Configure your Chrome browser to send traffic to the server
4.1 Click on the "google icon" to open the proxy extension.

4.2 Once open, select "configure your proxy settings manually" and enter "127.0.0.1" and "80" as host and port respectively. 

4.3 Click on "Save proxy settings". 

Now all your browser traffic is being proxies via the Akamai-staging-proxy server that you have running locally


![alt-text](https://github.com/akhiljay/Akamai-staging-proxy/blob/master/google-proxy-extension.png)

## You are all Set! 
Additional Notes:

> * If you need to add new staging environments, then please repeat step 3 above while your server is running

> * You can always revert back your Chrome browser's proxy settings by selecting "Use the system's proxy settings" within the google proxy extension

> * You can keep the node server running if you wish, but if you may wish to stop it anytime by clicking on CRTL-C








