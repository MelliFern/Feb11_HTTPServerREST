'use strict';

var http = require('http');
var action = require('./httpACTION.js');

	var server = http.createServer(function(req,res){
	var url = req.url.split('/');
	if(url[1] == 'school' && (req.method == 'POST' || req.method == 'PUT' 
							   || req.method == 'GET'||req.method == 'PATCH' 
							   ||req.method == 'DELETE')){

		action[req.method](req,res);


	} 
	else{

		res.writeHead(404, {'Content-Type' : 'text/plain'	});
		res.write('Invalid ACTION METHOD'); 
		res.end();	

	}

});

server.listen(3000, function(){
	console.log('server listening');

});