var path=require('path');
var fs=require('fs');
var async=require('async');
module.exports={
	createCollection:function(collection,dirPath){
		return new Promise((resolve,reject)=>{
			let collectionName=collection.collectionName;
			let columns=collection.columns;
			let field='';//the schema actually :"
			let createObject='{';
			let updateString='';
			let columnsName='["id",';
			/**
			   columns[0]->name
			   columns[1]->type
			   columns[2]->required
			   columns[3]->Unique or Not
			   columns[4]->ref for objectId thing
			**/
			for(let i=0;i<columns.length;i++){
				//columnsName
				columnsName+='"'+columns[i][0]+'",'
				//updateString
				updateString+='doc.'+columns[i][0]+' = req.body.'+columns[i][0]+' ? req.body.'+columns[i][0]+' : doc.'+columns[i][0]+';';
				//createObject
				createObject+=columns[i][0];
				createObject+=":req.body."+columns[i][0]+',';
				//field
				field+=columns[i][0]; //adding the name of the field
				if(columns[i][1]=='ObjectId'){ //if objectID
					if(columns[i][4].length==0){reject("Reference is not given ?");}
					field+=':{type:Schema.Types.ObjectId,ref:"'+columns[i][4]+'"';
				}
				else{
					field+=':{type:'+columns[i][1];
				}
				if(columns[i][2]=='Required'){ //if required
					field+=',required:true';
				}
				if(columns[i][3]=="Unique"){ //if unique
					field+=',unique:true';
				}
				field+='},';
			}
			
			field=field.slice(0,field.length-1); //removing the last ,
			//reading the mongoose model template and write to the new file
			var rw1=function(cb){
			 fs.readFile(path.join(__dirname,'templates','modelTemplate.js'),"utf8",(err,model)=>{
			   if(err){return cb(err,null);}
			   else{
			     model = model.replace(/{modelName}/, collectionName);
		             model = model.replace(/{schemaName}/g,collectionName+'Schema');
			     model = model.replace(/{fields}/, field);
			     var dirName="models";
			     //creating the models dir if not exist
			     if (!fs.existsSync(dirPath + '/' + dirName)){
				    //try and catch to handle the wrong paths issue
				    try{
				    	fs.mkdirSync(dirPath + '/' + dirName);}
				    catch(e){
					return cb(e,null);
				    }	
			     }
			     //write to the model file
			     fs.writeFile(dirPath+'/'+dirName+'/'+collectionName+'.js', model, {mode:0777, encoding: 'utf8'}, function (err) {
			       if (err) {return cb(err,null);}//rejecting due to writing issue
			       else{return cb(null,true);}
			     });
			   }
			 });
		       };
		      //reading the router template and write to the new file
			var rw2=function(cb){
			 fs.readFile(path.join(__dirname,'templates','routerMongoTemplate.js'),"utf8",(err,data)=>{
			   if(err){return cb(err,null);}
			   else{
			     columnsName=columnsName.slice(0,columnsName.length-1);
			     columnsName+=']';
			     createObject=createObject.slice(0,createObject.length-1);
			     createObject+='}';
			     data=data.replace(/{createObject}/g,createObject);
			     data=data.replace(/{updateString}/g,updateString);
			     data=data.replace(/{modelName}/g,collectionName);
			     data=data.replace(/{modelPath}/g,'"../models/'+collectionName+'.js"');
			     data=data.replace(/{columnsName}/g,columnsName);
			     var dirName="routes";
			     //creating the routes dir if not exist
			     if (!fs.existsSync(dirPath + '/' + dirName)){
				    //try and catch to handle the wrong paths issue
				    try{
				    	fs.mkdirSync(dirPath + '/' + dirName);}
				    catch(e){
					return cb(e,null);
				    }	
			     }
			     //write to the model file
			     fs.writeFile(dirPath+'/'+dirName+'/'+collectionName+'.js', data, {mode:0777, encoding: 'utf8'}, function (err) {
			       if (err) {return cb(err,null);}//rejecting due to writing issue
			       else{return cb(null,true);}
			     });
			   }
			 });
		       };


			//rw3
		       var rw3=function(cb){
			 fs.readFile(path.join(__dirname, 'templates','viewTemplate.ejs'),"utf8",(err,data)=>{
			   if(err){return cb(err,null);}
			   else{
			     data=data.replace(/{tableName}/g,collectionName);
			     var dirName="views";
			     if (!fs.existsSync(dirPath + '/' + dirName)){
				    try{
				    	fs.mkdirSync(dirPath + '/' + dirName);}
				    catch(e){
					return cb(e,null);
				    }
			      }
			     fs.writeFile(dirPath+'/'+dirName+'/'+collectionName+'s.ejs', data, {mode:0777, encoding: 'utf8'}, function (err) {
				 if (err) {return cb(err,null);}//rejecting due to writing issue
				 else{return cb(null,true);}
			       });
			   }
			 });
		       }

			//rw4

		
		       var rw4=function(cb){
			 fs.readFile(path.join(__dirname, 'templates','viewTemplate2.ejs'),"utf8",(err,data)=>{
			   if(err){return cb(err,null);}
			   else{
			     data=data.replace(/{tableName}/g,collectionName);
			     var dirName="views";
			     if (!fs.existsSync(dirPath + '/' + dirName)){
				    try{
				    	fs.mkdirSync(dirPath + '/' + dirName);}
				    catch(e){
					return cb(e,null);
				    }
			      }
			     fs.writeFile(dirPath+'/'+dirName+'/'+collectionName+'.ejs', data, {mode:0777, encoding: 'utf8'}, function (err) {
				 if (err) {return cb(err,null);}//rejecting due to writing issue
				 else{return cb(null,true);}
			       });
			   }
			 });
		       }





		      //stack of async
		      stack=[];
		      stack.push(rw1);
		      stack.push(rw2);
		      stack.push(rw3);
		      stack.push(rw4);
		      async.parallel(stack,function(err,results){
		      		if(err){reject(err);}
				resolve(true);
		      });



		});


	}
};
