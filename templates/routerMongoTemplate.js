var express = require('express');
var router = express.Router();
var {modelName} = require({modelPath});

/*
 * GET ALL
 */
router.get('/',function(req,res){
	//Getting all the data from the collection {modelName}
	{modelName}.find(function(err,docs){
		if(err){
			return res.status(500).json({
		            message: 'Error when getting the data from the database.',
		            error: err
		        });
		}
		var columnsName={columnsName};
		return res.render('{modelName}s.ejs',{rows:docs,columnsName:columnsName});
	});
});

/*
 * GET BY ID
 */
router.get('/:id',function(req,res){
	{modelName}.findOne({_id:req.params.id},function(err,doc){
		if(err){
			return res.status(500).json({
				    message: 'Error when getting the data from the database.',
				    error: err
				});
		}
		if(!doc){
			return res.status(404).json({
		            message: 'No such document'
		        });
		}
		var columnsName={columnsName};
		return res.render('{modelName}.ejs',{rows:[doc],columnsName:columnsName});
	});
});

/*
 * INSERT
 */
router.post('/insert',function(req,res){
    let {modelName}Obj={createObject};
    {modelName}.create({modelName}Obj,function (err,data) {
	    if (err){
			return res.status(500).json({
				    message: 'Error when creating the document.',
				    error: err
				});
	    }
	    return res.send(true);
  });


});
/*
 * UPDATE
 */
router.post('/update',function(req,res){
	{modelName}.findOne({_id:req.body.id},function(err,doc){
		if(err){
			return res.status(500).json({
				    message: 'Error when getting the data from the database.',
				    error: err
				});
		}
		if(!doc){
			return res.status(404).json({
		            message: 'No such document'
		        });
		}
		{updateString}
		doc.save(function(err,savedDoc){
			if(err){
				return res.status(500).json({
					    message: 'Error when saving to the database.',
					    error: err
					});
			}
			return res.send(true);
		});
	});
	


});

/*
 * DELETE
 */
router.post('/delete',function(req,res){
	{modelName}.findByIdAndRemove({_id:req.body.id},function(err){
		if(err){
			return res.status(500).json({
				    message: 'Error when deleting.',
				    error: err
				});
		}
		return res.send(true);
	});


});

module.exports = router;
