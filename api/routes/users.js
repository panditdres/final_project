var models = require('./../models'),
	bcrypt	= require('bcrypt'),
	jwt		= require('jsonwebtoken'),
	router = require('express').Router();

console.log("loading users route")

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

// add friend
router.put('/friends/:userId',function(req,res){
	console.log("adding friends, initial array is 0")
	var __user = req.body;
	console.log(typeof __user)
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		console.log("found user")
		user.updateAttributes({
			friends: __user
		});
		res.json({
			user:__user
		});
	})
})


// update users
router.put('/update/:userId', function(req,res){
	console.log("UPDATE USER REQ body", req.body)
	var __user = req.body;
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){

    	bcrypt.compare(__user.oldPassword, user.password, function(err, result) {
			console.log("BCRYPT __USER",__user.oldPassword);
			console.log("BCRYPT USER",user.password);
			console.log("compare password result", result);
		    if(result==true){
		    	bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(__user.newPassword, salt, function(err, hash) {
				        // Store hash in your password DB.
				        if(!err){
				        	__user.newPassword = hash;
				        	console.log("HASH PASS IF",__user.newPassword)
				        	user.updateAttributes({
								firstName: __user.firstName,
								lastName: __user.lastName,
								userName: __user.userName,
								email: __user.email,
								password: __user.newPassword
							});
							console.log("__user",__user)
							console.log("user",user)
							__user.id = req.params.userId;
							res.json({
								user:__user
							})
				        } else {
				        	console.log("ERROR line 30",err);
				        	res.json({error:err})
				        }
				    });
				});
		    }
		    else{
		    	res.status(403)
		    		.json({err:'unauhthorized'});
		    }
		});	        		       
	});	
})

module.exports = router;