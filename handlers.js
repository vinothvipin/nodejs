
let handlers = {};
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
module.exports = handlers;