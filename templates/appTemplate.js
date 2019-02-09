const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const http=require('http');
const fs=require('fs');
const app=express();
var httpserver=http.createServer(app);
const mysql=require('mysql');

//require tables routes



{requireBlock}



//database
var database=require(path.join(__dirname,'/db.js'));
var db=database.getPool();
db.on('error',function(){
	console.log("error in connecting to the database");
	});

//DECRYPTORIC TEXT :" REMOVE IT IF YOU WISH NOTHING WILL HAPPEN HOPEFULLY :"
console.log("Hello there,THIS IS A COOL DECRYPTORIC APP!");




//setting up the view engine and the public folder for assets and the views folder
app.set('static',path.join(__dirname,'static'));
app.use('/static',express.static('static'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');




// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





//Index page the main page route
app.get('/',function(req,res){
	db.query("SELECT table_name FROM information_schema.tables where table_schema='{dbName}';",function(err,rows){
		if(err){res.render('Error.ejs',{databaseError:true});}
		else{res.render('Index.ejs',{rows:rows,projectName:"{projectName}"});}

	});
});






//use tables routes
{useBlock}



//error things
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
httpserver.listen({port});
