# Akamai-staging-proxy Server and Chrome Extension Installation and User Guide

A Node based http(s) proxy that can be configured to point to Akamai staging environments without overiding the host file of your machine. 

Maintained by Akhil Jayaprakash @ Akamai Technologies [Twitter](https://twitter.com/akhiljp_dev)

![alt-text](https://github.com/akhiljay/Akamai-staging-proxy/blob/master/proxy-screenshot.png)

## Installation Guide

### Step 1: Install the "Akamai-staging-proxy" server locally 

#### 1.1: Clone this repo locally
````
git clone https://github.com/akhiljay/Akamai-staging-proxy.git
````
> Navigate to the folder
````
cd Akamai-staging-proxy
````

#### 1.2: Install all dependencies needed for the server
````
npm install
````
#### 1.3: Run Node server
````
node index.js
````
> The server is now running on localhost:5050

### Step 2: Install Google Example Chrome Proxy Extension
This extension helps you securely send traffic over to the node server running locally. This combination allows for both HTTP and HTTPS traffic

Click [here](https://chrome.google.com/webstore/detail/cginnnkpamdfapidljgnkkjpjaajiaje/) to download the chrome extension code


## Usage Instructions

### Step 1: Configure "Akamai-staging-proxy" extension with your Akamai staging enviornment settings
Enter multiple hostname:staging-hostname combination into the  separated by a comma
For example:

1. For single hostname & staging hostname combination enter : www.foo.com:www.foo.com.edgekey-staging.net

2. For multiple hostnames & staging hostnames combination enter : www.foo.com:www.foo.com.edgekey-staging.net,static.foo.com:static.foo.edgekey-staging.net

![alt-text](https://github.com/akhiljay/Akamai-staging-proxy/blob/master/proxy-usage-1.png)


### Step 3: Click save to start routing chrome browser traffic to Akamai Staging 

Now all your browser traffic is being proxies via the Akamai-staging-proxy server that you have running locally


![alt-text](https://github.com/akhiljay/Akamai-staging-proxy/blob/master/proxy-usage-2.png)

## You are all Set! 
Additional Notes:

> * You can always revert back your Chrome browser's proxy settings by selecting "Use the system's proxy settings" within the google proxy extension

> * You can keep the node server running if you wish, but if you may wish to stop it anytime by clicking on CRTL-C







