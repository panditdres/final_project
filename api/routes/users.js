var models = require('./../models'),
	router = require('express').Router();

//get all users
router.get('/',function(req,res){
	models.Users.findAll()
	.then(function(users){
		res.json({users:users});
	})
})

// get one user
router.get('/:userId', function(req,res){
	console.log(req.params);
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		console.log(user)
		res.send(user);
	})
})

//delete test accounts via url bar
router.get('/remove/:userId',function(req,res){
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		user.destroy();
		res.json({
			deleted:true
		});	
	});
});

module.exports = router;