const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const fs = require('fs');
const config = {};
config.http_port = 3000;

let server = {};
let handlers ={};

var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
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
		 let route = typeof(server.router[request_data.trimmedPath]) !== 'undefined' ? server.router[request_data.trimmedPath] : handlers.welcome
		 //console.log(route);
		 route(request_data,(statusCode,payload,contentType)=>{
		 	//console.log('test');
		 	console.log(payload);
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
		           payloadString = typeof(payload) == 'string'? payload : '';
		         }
		 	   res.writeHead(statusCode);
         	   res.end(payloadString);

		 });
		 
	});


	
	
	// // res.end(`${request_data.parsedUrl}`);
	
})
// Define the request router


let getPage = function(file,callback){
	let publicDir = path.join(__dirname,'/public/');
	console.log(publicDir+file);
	fs.readFile(publicDir+file,(err,data)=>{
	 if(!err && data){
	 	 
        callback(data);
      } else {
        console.log('No file could be found');
      }

	})
}
handlers.index= function (data,callback){
	page_data = getPage('index.html',(data)=>{
		callback(200,data,'html');
	});
	
}
handlers.pageNotFound= function (data,callback){
	page_data = getPage('404.html',(data)=>{
		callback(200,data,'html');
	});
}
handlers.welcome= function (data,callback){
	console.log('welcome');
	let page_data = data;
	page_data.msg = "welcome to Node js master class home work #1";
	callback(200,page_data,'json');
}
server.router = {
  '/' : handlers.welcome,
  //'' : handlers.pageNotFound,
  'hello/world' : handlers.welcome,
  
};
server.http_server.listen(config.http_port,() => console.log(`Node server is listen the port ${config.http_port}`))