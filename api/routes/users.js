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
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		// console.log("GET USER",user)
		res.send(user);
	})
})

// delete account with click - works
router.delete('/:userId', function(req,res){
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		//console.log("USER", user)
		user.destroy();
		res.json({
			deleted: true
		})
	})
})

// add friend
router.put('/friends/:userId',function(req,res){
	var __user = req.body;
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		//console.log("found user")
		user.updateAttributes({
			friends: __user
		});
		res.json({
			user:__user
		});
	})
})

// update location playing
router.put('/location/:userId',function(req,res){
	var __user = req.body
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){
		//console.log("USER",user)
		//console.log("ADDING LOCATION TO USER")
		user.updateAttributes({
			playing: __user
		});
		res.json({
			user:__user
		});
	})
})

// update friend request
router.put('/friendRequest/:userId', function(req,res){
	// console.log("FRIEND REQUEST",req.params)
	var where = {where:{id:req.params.userId}}
	var __user = req.body;
	// console.log("USER FRIEND REQUEST",__user)
	models.Users.find(where).then(function(user){
		user.updateAttributes({
			friendRequestFrom: __user
		});
		res.json({
			user:__user
		});
	})
})

// update profile picture
router.put('/profilePic/:userId', function(req,res){
	var where = {where:{id:req.params.userId}}
	var __user = req.body;
	// console.log('PROFILE PICTURE WHERE',where)
	// console.log("PROFILE PICTURE USER",__user)
	models.Users.find(where).then(function(user){
		user.updateAttributes({
			profilePic: __user.path
		});
		res.json({
			user:__user
		});
	})
})

// update users
router.put('/update/:userId', function(req,res){
	var __user = req.body;
	console.log(__user)
	var where = {where:{id:req.params.userId}}
	models.Users.find(where).then(function(user){

    	bcrypt.compare(__user.oldPassword, user.password, function(err, result) {
		    if(result==true){
		    	bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(__user.newPassword, salt, function(err, hash) {
				        // Store hash in your password DB.
				        if(!err){
				        	__user.newPassword = hash;
				        	user.updateAttributes({
								firstName: __user.firstName,
								lastName: __user.lastName,
								username: __user.username,
								email: __user.email,
								password: __user.newPassword
							});
							__user.id = req.params.userId;
							res.json({
								user:__user
							})
				        } else {
				        	res.json({error:err})
				        }
				    });
				});
		    }
		    else{
		    	res.status(403)
		    		.json({err:'wrong password'});
		    }
		});	        		       
	});	
})

module.exports = router;