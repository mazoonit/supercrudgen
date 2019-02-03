var path=require('path');
var fs=require('fs');
var async=require('async');
module.exports={
  createTable:function createTable(tableObject,dirPath,db){
	//createTable function return a promise IT resolve if everything is okay downthere and reject if not
	return new Promise((resolve,reject)=>{
    //query making out of the request
    var columns='';
    var questionMarks='';
    var reqbody='[';
    var q="CREATE TABLE "+tableObject.tableName+"(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,";
    var updateColumns='';
    var columnsName='["id",';
    for(var i=0;i<tableObject.columns.length;i++){
      if(tableObject.columns[i][0]=="id"){continue;}
      columns=columns+tableObject.columns[i][0]+',';
      questionMarks=questionMarks+'?,';
      reqbody=reqbody+"req.body."+tableObject.columns[i][0]+",";
      updateColumns=updateColumns+tableObject.columns[i][0]+"=?,";
      columnsName=columnsName+'"'+tableObject.columns[i][0]+'",';
      q=q+tableObject.columns[i][0]+" "+tableObject.columns[i][1];
      if(tableObject.columns[i][1]=="VARCHAR"){
        if(tableObject.columns[i][2].length!=0){
          q=q+"("+tableObject.columns[i][2]+")"}
        else{
          q=q+"(100)";
        }
      }
      if(tableObject.columns[i][3].length!=0 && tableObject.columns[i][5]=="NONE" && tableObject.columns[i][6]=="NORMAL" ){
        q=q+' DEFAULT '+tableObject.columns[i][3];}
      if(tableObject.columns[i][4]=='NOT NULL'){
        q=q+" NOT NULL";
      }
      if(tableObject.columns[i][5]!='NONE'){
        q=q+" "+tableObject.columns[i][5];
      }
      if(tableObject.columns[i][6]=="AUTO_INCREMENT"){
        q=q+" "+tableObject.columns[i][6];
      }
      if(i<tableObject.columns.length-1){q=q+",";}
    }
    q+=")";
    //end of query making
    //console.log(q);
    //query executing
    db.query(q,function(err,r){
      if(err){reject("Database Error!");} //rejecting due to database issue
      else{
	//starting in reading router and views templates and fill them
        var rw1=function(cb){
         fs.readFile(path.join(__dirname,'templates','routerTemplate.js'),"utf8",(err,data)=>{
           if(err){cb(err,null);}
           else{
             data=data.replace(/{tableName}/g,tableObject.tableName);
             columns=columns.slice(0,columns.length-1);
             data=data.replace(/{columns}/g,columns);
             questionMarks=questionMarks.slice(0,questionMarks.length-1);
             data=data.replace(/{questionMarks}/g,questionMarks);
             var reqbodyUpdate=reqbody;
             reqbodyUpdate+="req.body.id]";
             data=data.replace(/{reqbodyUpdate}/g,reqbodyUpdate);
             reqbody=reqbody.slice(0,reqbody.length-1);
             reqbody=reqbody+"]";
             data=data.replace(/{reqbody}/g,reqbody);
             updateColumns=updateColumns.slice(0,updateColumns.length-1);
             data=data.replace(/{updateColumns}/g,updateColumns);
             columnsName=columnsName.slice(0,columnsName.length-1);
             columnsName=columnsName+"]";
             data=data.replace(/{columnsName}/g,columnsName);
             var dirName="routes";
             if (!fs.existsSync(dirPath + '/' + dirName)){
                    fs.mkdirSync(dirPath + '/' + dirName);}
             fs.writeFile(dirPath+'/'+dirName+'/'+tableObject.tableName+'.js', data, {mode:0777, encoding: 'utf8'}, function (err) {
               if (err) {cb(err,null);}//rejecting due to writing issue
               else{cb(null,true);}
             });
           }
         });
       };
       var rw2=function(cb){
         fs.readFile(path.join(__dirname, 'templates','viewTemplate.ejs'),"utf8",(err,data)=>{
           if(err){cb(err,null);}
           else{
             data=data.replace(/{tableName}/g,tableObject.tableName);
             var dirName="views";
             if (!fs.existsSync(dirPath + '/' + dirName)){
                  fs.mkdirSync(dirPath + '/' + dirName);}
             fs.writeFile(dirPath+'/'+dirName+'/'+tableObject.tableName+'s.ejs', data, {mode:0777, encoding: 'utf8'}, function (err) {
                 if (err) {cb(err,null);}//rejecting due to writing issue
                 else{cb(null,true);}
               });
           }
         });
       }
       var rw3=function(cb){
         fs.readFile(path.join(__dirname, 'templates','viewTemplate2.ejs'),"utf8",(err,data)=>{
           if(err){cb(err,null);}
           else{
             data=data.replace(/{tableName}/g,tableObject.tableName);
             var dirName="views";
             if (!fs.existsSync(dirPath + '/' + dirName)){
                  fs.mkdirSync(dirPath + '/' + dirName);}
             fs.writeFile(dirPath+'/'+dirName+'/'+tableObject.tableName+'.ejs', data, {mode:0777, encoding: 'utf8'}, function (err) {
                 if (err) {cb(err,null);}//rejecting due to writing issue
                 else{cb(null,true);}
               });
           }
         });
       }
       var stack=[];
       stack.push(rw1);
       stack.push(rw2);
       stack.push(rw3);
       async.parallel(stack,function(err,result){
			if(err){reject("writing error");
				console.log("Error happened while writing to a file.")}//all the cbs errors comes here and will be sent back to the big catch
			else{resolve("Done");}//the big and only resolve it means that everything is okay
		
       });
      }
    });
	});
    }

}
