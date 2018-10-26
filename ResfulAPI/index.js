/*
* Primary file for the API
*
*/

//Dependencies
/*
* Primary file for the API
*
*/

//Dependencies
const http = require('http');
const https = require('http');
const url =  require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');


// Instantiate the HTTP Server
let httpServer = http.createServer((req, res) =>{
  unifiedServer(req, res);
});
//Start the HTTP server
httpServer.listen(config.httpPort, ()=>{
  console.log(`The server is listening on port ${config.httpPort} now in ${config.envName} mode.`);
});

//Instantiate the HTTPS Server
let httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')

}
let httpsServer = https.createServer(httpsServerOptions, (req, res) =>{
    unifiedServer(req, res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, ()=>{
  console.log(`The server is listening on port ${config.httpsPort} now in ${config.envName} mode.`);
});

//All the server logic for both http and https createServer
var unifiedServer = (req,res) =>{
  //Get the URL and parse it
  let parsedUrl = url.parse(req.url, true);

  //Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //Get the query string as an object
  let queryStringObject = parsedUrl.query;

  //Get the HTTP Method
  let method = req.method.toLowerCase();

  //Get the headers as an object
  let headers = req.headers;
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data)=>{
    buffer += decoder.write(data);
  });
  req.on('end', ()=>{
    buffer += decoder.end();

    //Choose the handler this request should go to. If one is not found, use the notFound() handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    //Construct the data object to send to the handler
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' :  headers,
      'payload' : buffer
    };

    //Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload)=>{
      //Use the status coide called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //Use the payload valled back by the handler, or default to empty object
      payload = typeof(payload) == 'object' ? payload : {};

      //Convert the payload to a String
      let payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);

      //Log the request pathname
      console.log('returning this response: ', statusCode, payloadString);

    });

  });


}


//Define the handlers
let handlers = {};

//Ping handler
handlers.ping = (data, callback) =>{
  //Callback a http status code and a payload object
  callback(200);
};

//Not found handlers
handlers.notFound = (data, callback) =>{
  callback(404);
};

let router = {
  'ping' : handlers.ping
};
