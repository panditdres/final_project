var models = require('./../models'),
	router = require('express').Router();

//get all users - works
router.get('/',function(req,res){
	models.Users.findAll()
	.then(function(users){
		res.json({users:users});
	})
})

// get one user - works
router.get('/:userId', function(req,res){
	console.log(req.params);
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		console.log(user)
		res.send(user);
	})
})

// delete account with click - works
router.delete('/:userId', function(req,res){
	console.log("DELETE USER")
	console.log(req.params)
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		console.log("USER", user)
		user.destroy();
		res.json({
			deleted: true
		})
	})
})

// update users
router.put('/update/:userId', function(req,res){
	console.log("UPDATE USER")
	var __user = req.body;
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		console.log("USER", user)
		user.updateAttributes({
			firstName: __user.firstName,
			lastName: __user.lastName,
			email: __user.email
		});
		__location.id = req.params.locationId
		res.json({
			user:__user
		})
	})
})

module.exports = router;