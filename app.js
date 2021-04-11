const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080
const simulator = require('../Simulator');
const http = require('http');
const url = require('url');

app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))

const simulatorPort = 3030;
http.createServer((req, res) => {
    const reqUrl = url.parse(req.url).pathname;
    const deviceId = req.headers.deviceid;

    if (reqUrl === "/solar_api/v1/GetInverterRealtimeData.cgi") {
        res.writeHead(200, {
            'Content-Type': "application/json"
        });
        const response = simulator.inverterCloudSimulator.getResponse(deviceId);
        res.end(JSON.stringify(response));
    }
    if (reqUrl === "/provision") {
        res.writeHead(200, {
            'Content-Type': "application/json"
        });
        const response = simulator.inverterCloudSimulator.provisionDevice();
        res.end(JSON.stringify(response));
    }
    res.writeHead(400, {
        'Content-Type': "application/json"
    });
    res.end();
}).listen(simulatorPort);