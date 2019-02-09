//tableName.js
var express = require('express');
var router = express.Router();
var database=require('../db.js');
var db=database.getPool();

router.get('/',function(req,res){
	//select all get
	var q="SELECT * FROM {tableName}";
	var columnsName={columnsName};
	db.query(q,function(err,rows){
		if(err){res.render('Error.ejs',{databaseError:true});}
		else{
		res.render("{tableName}s.ejs",{columnsName:columnsName,rows:rows});
		}
	});
});
router.get('/:id',function(req,res){
	//Select only one get
	var q="SELECT * FROM {tableName} WHERE id= ?";
	var columnsName={columnsName};
	db.query(q,[req.params.id],function(err,rows){
		if(err){res.render('Error.ejs',{databaseError:true});}
		else{
			if(rows.length<=0){res.render("Error.ejs");}
			else{
				res.render("{tableName}.ejs",{columnsName:columnsName,rows:rows});
			}		
		}
	});
});
router.post('/delete',function(req,res){
	//delete post
	var q="DELETE FROM {tableName} WHERE id= ?"
	db.query(q,[req.body.id],function(err,rows){
		if(err){res.send(false);}
		else{
			res.send(true);
		}
	});
});
router.post('/insert',function(req,res){
	//insert post
	var q="INSERT INTO {tableName} ({columns}) VAlUES ({questionMarks})";
	db.query(q,{reqbody},function(err){
		if(err){res.send(false);}
		else{res.send(true);}
	});
});
router.post('/update',function(req,res){
	//update post
	var q="UPDATE {tableName} SET {updateColumns} WHERE id=?";
	db.query(q,{reqbodyUpdate},function(err,rows){
		if(err){res.send(false);}
		else{res.send(true);}
	});
});

module.exports=router;
