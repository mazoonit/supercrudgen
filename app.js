#!/usr/bin/env node
const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const http=require('http');
const fs=require('fs');
let chalk=require('chalk');
let figlet=require('figlet');
const app=express();
var httpserver=http.createServer(app);
const mysql=require('mysql');
const async=require('async');
const createTable=require(path.join(__dirname,'createTable.js'));
const createCollection=require(path.join(__dirname,'createCollection.js'));
let os=require('os');


//writing my name on the terminal :" YOU SHOULDN'T REMOVE IT, IF YOU DID THE WHOLE UNIVERSE WILL COLLAPSE X_X
console.log(
	chalk.red(
		figlet.textSync("decryptor007")
	)
);


//setting up the view engine and the public folder for assets and the views folder
app.set('static',path.join(__dirname,'static'));
app.use('/static',express.static('static'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');




// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//get requests
app.get('/',function(req,res){
	res.render("home.ejs");
});
app.get('/sql',function(req,res){
	res.render("sql.ejs");

});
app.get('/nosql',function(req,res){
	res.render("nosql.ejs");
})

//sql create app route
app.post('/createtable',function(req,res){
		/**
			[0,1,2,3,4,5,6,7]->[id,type,length,default,NULL,primary/unique,auto_increment]
			Request Architecture
				JSON Object:{
					dbHost:"",
					dbUser:"",
					dbPassword:"",
					dbName:"",
					path:"",
					projectName:"",
					tables:[{tableName:"",columns:[[0,1,2,3,4,5,6,7],[],.....]},{},....]

				}


		**/
		//connecting to the user db
		var db= mysql.createConnection({
		  host:req.body.dbHost,
		  user:req.body.dbUser,
		  password:req.body.dbPassword,
		  database:req.body.dbName});
		db.connect(function(err) {
		  if (err){
			console.log("Database Error!");			
			res.send(false);}
		  else{
			//do the things

			var dirPath=req.body.path;
			var dirName=req.body.projectName;
			//CREATING PROJECT DIR IF NOT ALREADY CREATED
			if (!fs.existsSync(dirPath + '/' + dirName)){
				fs.mkdirSync(dirPath + '/' + dirName,);
				fs.chmodSync(dirPath+'/'+dirName, 0777);}
			//Creating views DIR
			if (!fs.existsSync(dirPath + '/' + dirName+'/views')){
				fs.mkdirSync(dirPath + '/' + dirName+'/views',);
				fs.chmodSync(dirPath+'/'+dirName+'/views', 0777);}
			//creating static DIR
			if (!fs.existsSync(dirPath + '/' + dirName+'/static')){
				fs.mkdirSync(dirPath + '/' + dirName+'/static',);
				fs.chmodSync(dirPath+'/'+dirName+'/static', 0777);}
				

			//createTable module got a function that returns a promise so I assemble all the promises here
			let promises=[];
			for(var i=0;i<req.body.tables.length;i++){
				promises.push(createTable.createTable(req.body.tables[i],dirPath+'/'+dirName,db));
			}
			Promise.all(promises).then((results)=>{
				//If the table promises is cool and there's no problems with the database or writing in routes and views
				var stack=[];
				//app file creation
				var createApp=function(callback){
					fs.readFile(path.join(__dirname, 'templates','appTemplate.js'),"utf8",(err,data)=>{
					   if(err){callback("Reading file error.",null);}
					   else{
						var useBlock="";
						var requireBlock="";
						var tableName;
						for(var i=0;i<req.body.tables.length;i++){
							tableName=req.body.tables[i].tableName;
							useBlock+="app.use('/"+tableName+"',"+tableName+');';
							requireBlock+="const "+tableName+"=require(path.join(__dirname,'routes','"+tableName+".js'));";
						}
					     data=data.replace(/{requireBlock}/g,requireBlock);
					     data=data.replace(/{useBlock}/g,useBlock);
					     data=data.replace(/{port}/g,req.body.port);
					     data=data.replace(/{dbName}/g,req.body.dbName);
					     data=data.replace(/{projectName}/g,req.body.projectName);
				    fs.writeFile(dirPath+'/'+dirName+'/'+'app.js', data, {mode:0777, encoding: 'utf8'},(err)=>{
					 if (err) {callback("Writing to file error.",null);}
					 else{callback(null,true);}
				       });
				   }
					 });
				}
				stack.push(createApp);
				//db.js file creation
				var createDB=function(callback){
					fs.readFile(path.join(__dirname, 'templates','dbTemplate.js'),"utf8",(err,data)=>{
					   if(err){callback("Reading file error.",null);}
					   else{
					     data=data.replace(/{dbName}/g,req.body.dbName);
					     data=data.replace(/{dbHost}/g,req.body.dbHost);
					     data=data.replace(/{dbPassword}/g,req.body.dbPassword);
					     data=data.replace(/{dbUser}/g,req.body.dbUser);
					   	
				    fs.writeFile(dirPath+'/'+dirName+'/'+'db.js', data, {mode:0777, encoding: 'utf8'},(err)=>{
					 if (err) {callback("Writing to file error.",null);}
					 else{callback(null,true);}
				       });
				   }
					 });
				}
				stack.push(createDB);
				//create package.json file
				var createPackage=function(callback){
					fs.readFile(path.join(__dirname, 'templates','packageTemplate.json'),"utf8",(err,data)=>{
					   if(err){callback("Reading file error.",null);}
					   else{
					     	data=data.replace(/{projectName}/g,req.body.projectName);
				    	fs.writeFile(dirPath+'/'+dirName+'/'+'package.json', data, {mode:0666, encoding: 'utf8'},(err)=>{
						 if (err) {callback("Writing to file error.",null);}
						 else{callback(null,true);}
					});
				   	  
					  }
					});			
				}
				stack.push(createPackage);
				//copying files
				var copyError=function(callback){
					fs.copyFile(path.join(__dirname,'templates','errorTemplate.ejs'),dirPath+'/'+dirName+'/views/Error.ejs', (err) => {
					  if (err){callback("Copying file error.",null);}
					  else{callback(null,true);}
					});
				}
				stack.push(copyError);
				var copyIndex=function(callback){
					fs.copyFile(path.join(__dirname,'templates','indexTemplate.ejs'), dirPath+'/'+dirName+'/views/Index.ejs', (err) => {
					  if (err){callback("Copying file error.",null);}
					  else{callback(null,true);}
					});
				}
				stack.push(copyIndex);
				var copyJs=function(callback){
					
					fs.copyFile(path.join(__dirname,'static','frontendlib.js'),dirPath+'/'+dirName+'/static/frontendlib.js', (err) => {
					  if (err){callback("Copying file error.",null);}
					  else{callback(null,true);}
					});
				}
				stack.push(copyJs);
				var copyCss=function(callback){
					fs.copyFile(path.join(__dirname,'static','style.css'),dirPath+'/'+dirName+'/static/style.css', (err) => {
					  if (err){callback("Copying file error.",null);}
					  else{callback(null,true);}
					});
				}
				stack.push(copyCss);

				
				//async dark magic :'D
				//actually just doing the reading,writing and copying in parallel:"
				async.parallel(stack,function(err,result){
					if(err){
						console.log(err);					
						res.send(false); //error in one of the parallel tasks
					}
					else{
						//everything is cool
						console.log("Done!");						
						res.send(true);}
				});
			}).catch((errors)=>{
				//IF there's an error with database or writing routes or views
				console.log(errors);
				res.send(false);
			});
		}
	});
});



//mongoose route
app.post('/createCollection',function(req,res){
	//dirName+dirPath from the request
	//the request architecture
	/**
		[0,1,2,3,4] -> [name,type,Required,Unique,ref]
		JSON Object -> {
				collections:
					[{columns:[[0,1,2,3,4],[],....],collectionName:""},{},{}...]
				,path:""
				,projectName:""
				}
	**/
	let dirName=req.body.projectName;
	let dirPath=req.body.path;
	//CREATING PROJECT DIR IF NOT ALREADY CREATED
	if (!fs.existsSync(dirPath + '/' + dirName)){
		fs.mkdirSync(dirPath + '/' + dirName,);
		fs.chmodSync(dirPath+'/'+dirName, 0777);}
	//Promises ARRAY
	//Every promise is returned from a function that creates a collection's files(mongoose model,routes,views)
	let promises=[];
	for(var i=0;i<req.body.collections.length;i++){
		promises.push(createCollection.createCollection(req.body.collections[i],dirPath+'/'+dirName));
	}
	Promise.all(promises).then((results)=>{
		//the files of all the collection created successfully ^
		//creating static DIR
		if (!fs.existsSync(dirPath + '/' + dirName+'/static')){
			fs.mkdirSync(dirPath + '/' + dirName+'/static',);
			fs.chmodSync(dirPath+'/'+dirName+'/static', 0777);}

		var stack=[];//stack of all static files creating functions
		var copyJs=function(callback){
					
				fs.copyFile(path.join(__dirname,'static','frontendlib.js'),dirPath+'/'+dirName+'/static/frontendlib.js', (err) => {
					if (err){callback("Copying file error.",null);}
					else{callback(null,true);}
					});
				};
		stack.push(copyJs);
		var copyCss=function(callback){
			fs.copyFile(path.join(__dirname,'static','style.css'),dirPath+'/'+dirName+'/static/style.css', (err) => {
				if (err){callback("Copying file error.",null);}
				else{callback(null,true);}
			});
			    };
		stack.push(copyCss);
		async.parallel(stack,function(err,result){
			if(err){
				console.log("Error in creating files.");					
				res.send(false); //error in one of the parallel tasks
				}
				else{
					//everything is cool
					console.log("Done!");					
					res.send(true);}
				});
	})
	.catch((errs)=>{
		//Error happened while creating the files
		console.log(errs);
		res.send(false);
	});
	//Simple async styles to deal with files/directories creation^
});




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
httpserver.listen(7070);
