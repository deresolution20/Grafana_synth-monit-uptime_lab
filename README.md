# Grafana_synth-monit-uptime_lab
Testing the difference between uptime and reachability


<h2>Description</h2>

Customer wants to know the difference between uptime and reachability.  This is a test lab built to test this.

<br />

<h2>Languages and Utilities Used</h2>


- Nodejs Express
- Grafana Synthetic Monitoring


<h2>Environments and tools Used </h2>


- Ubuntu 22.04-GCP VM
- Grafana Cloud 9.5.3
- Node v20.2.0


<h2>Documentation and learnings Used</h2>

- Synthetic monitoring documentation: https://grafana.com/docs/grafana-cloud/synthetic-monitoring/
- Some documentation on NodeJS: 
- https://nodejs.org/en/docs/guides/getting-started-guide
- https://www.freecodecamp.org/news/build-a-secure-server-with-node-and-express/

<h2>Scope and exclusions</h2>
This test lab in this guide assumes a working knowledge of standing up a nodejs server in GCP/AWS/Azure for testing purposes. 

<h2>Guidelines</h2>

To create a Node.js server that can handle basic button clicks and form submissions, you can follow the guidelines outlined below. 

<h3>1. Setting up the Node.js Server</h3>

Setup a GCP/AWS/Azure VM and run the following to install NodeJS and Npm(Node package manager).  Once installed use npm init to initialize the project and create the package.json file in your directory and npm install express which is the library needed to create the HTTP server.

</br>

```
sudo apt-get update
sudo apt-get install nodejs npm
mkdir test-server
cd test-server
npm init -y
npm install express
```


<h3>2. Setup the server</h3>

Create the server file "server.js" in a text editor and copy the code and save it:
This code will delay the http response by 5 seconds, which will cause the SM check to fail both uptime and reachability since the response is delayed by 5 seconds and never gets a successful check.  Test it with a Curl command.

</br>

```
const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    setTimeout(() => {
        res.status(200).send('Hello World!');
    }, 5000); // 5 seconds delay
});


app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`)
});
```


<h3>3. Create the Http check in Grafana</h3>

- Create your HTTP check in Grafana SM.  
- Make sure to use the external IP of the server and port, set frequency to speed things up, set timeout to 3 seconds, 1-4 probes, and set the validation to:valid http versions: HTTP/1.1 and HTTP/2ignore SSL

- This test will force the http response to be delayed by 5 seconds, which causes the uptime check to fail (0%) since the timeout is set to 3 seconds, and the reachability to fail to (0%) since no probes are successful, even though you are able to get a response from the server.

```
Test using curl: curl http://<vm-ip>:3000
```

<h2>Procedure</h2>

To create a random server that will timeout randomly between 1 and 6 seconds, use the following code to set the timeout delay randomly between 1 and 6 seconds.  With a low amount of probes in use(1-2), you should see closer to 50% uptime and the reachability even lower than that. If you increase the probes to closer to 10, the uptime will rise because if any of them successfully get a response within the timeout period, the Uptime would still be high, because as long as the server is reachable by at least one probe, it's considered as 'up'. 
<br> <br>
 
```
const http = require('http');


const server = http.createServer((req, res) => {
    // Generate a random delay between 1 and 6 seconds
    const delay = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World\n');
    }, delay * 1000);  // Convert to milliseconds
});


server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:3000/');
});

```

</br>
example output in Grafana:

![Greenshot 2023-05-29 11 51 47](https://github.com/deresolution20/Grafana_synth-monit-uptime_lab/assets/85902399/69e5918d-9496-4a61-b03f-36764a8bb0d1)
