/**
* Main entry for server. Run with node server.js
*/

const http = require('http');
const domain = require('./domain.js');
const groundControl = require('./groundControl.js');

http.createServer((request, response) => {

	response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });


	var body = [];
	request.on('data', function(chunk) {
  		body.push(chunk);
	}).on('end', function() {
  		body = Buffer.concat(body).toString();
  		
  		worldState = {};
  		try {
	  		worldState = new domain.WorldState(JSON.parse(body));
  		}catch(err) {
  			console.log('Failed to parse worldState from request body: [' + body + '] due to ' + err);
  		}

  		var controls = groundControl.requestControls(worldState);
	  	response.write(JSON.stringify(controls));
  		response.end();
	});

}).listen(8080);


console.log("Server running in http://localhost:8080/")