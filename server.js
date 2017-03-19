/**
* Main entry for server. Run with node server.js
*/

const http = require('http');

http.createServer((request, response) => {

	var body = [];
	request.on('data', function(chunk) {
  		body.push(chunk);
	}).on('end', function() {
  		body = Buffer.concat(body).toString();
  		console.log(body);
  		console.log(JSON.stringify(body));
	});


    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });


    var controls = {
    	thrust: 0.99,
    	rcs: {
    		pitch: 0.01,
    		yaw: 0.01
    	}
    };

    response.write(JSON.stringify(controls));
    response.end();

}).listen(8080);


console.log("Server running in http://localhost:8080/")