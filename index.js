const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
global.path = require('path');
global.fs = require('fs');
const handlers = require(__dirname+'/handlers');

 
const config = {};
config.http_port = 3000;
let server = {}; 

server.router = {
  '/' : handlers.index,
  '404' : handlers.pageNotFound,
  'hello/world' : handlers.welcome,
  
};
 
server.http_server = http.createServer((req,res)=>{

 
	let request_data = {};
	request_data.parsedUrl = url.parse(req.url, true);
	request_data.path = request_data.parsedUrl.pathname;
	request_data.trimmedPath = request_data.path.replace(/^\/+|\/+$/g, '');
	
	request_data.queryStringObject = request_data.parsedUrl.query;
	request_data.method = req.method.toLowerCase();
	const decoder = new StringDecoder('utf-8');
	request_data.buffer = '';	
	req.on('data',(data)=>{ 
		 request_data.buffer += decoder.write(data);		
	});
	req.on('end',()=>{ 
		 request_data.buffer += decoder.end();
		  
		 let route = '';
		 if(request_data.trimmedPath){
		  route = typeof(server.router[request_data.trimmedPath]) !== 'undefined' ? server.router[request_data.trimmedPath] : handlers.pageNotFound;
		}else{
		  route = handlers.index;
		}
		 
		 route(request_data,(statusCode,payload,contentType)=>{
		 	//console.log('test');
		 	 
		 		contentType = typeof(contentType) == 'string' ? contentType : 'json';
		 		statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
		 		let payloadString = '';
		         if(contentType == 'json'){
		           res.setHeader('Content-Type', 'application/json');
		           payload = typeof(payload) == 'object'? payload : {};
		           payloadString = JSON.stringify(payload);
		         }

		         if(contentType == 'html'){
		           res.setHeader('Content-Type', 'text/html');
		           payloadString =  payload ;
		         }
		 	   res.writeHead(statusCode);
         	   res.end(payloadString);

		 });
		 
	});


	
	
	// // res.end(`${request_data.parsedUrl}`);
	
})
// Define the request router





server.http_server.listen(config.http_port,() => console.log(`Node server is listen the port ${config.http_port}`))