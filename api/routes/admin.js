var models = require('../models'),
	bcrypt	= require('bcrypt'),
	jwt		= require('jsonwebtoken'),
	router = require('express').Router();

console.log("loading admin route");

router.get('/',function(req,res){
	//check if admin user exists
	var where = {where:{email:'admin@map.com'}};
	models.Users.findAll(where).then(function(users){
		if('0' in users){
			res.send(users);
		}
		else{
			//admin user obj
			var user_obj = {
				email:'admin@map.com',
				password:'brainstation'
			}
			//add to database model and respond with object
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(user_obj.password, salt, function(err,hash){
					if(!err){
						user_obj.password = hash;
						console.log(user_obj.password)
						models.Users.create(user_obj)
						.then(function(user){
							console.log(user)
							res.json({user:user});
						});
					} else {
						console.log("ERROR ADMIN line 30", err)
					}
				})
			})		
			res.send('<h1>Admin Account Created</h1><p>Log In:admin@shop.com<br>Password:brainstation</p>');
		}		
	});
});

router.post('/login',function(req,res){
	console.log("Post admin login")
	var __user = req.body;
	console.log(__user);

	var where = {where:{email:'admin@map.com'}};
	models.Users.find(where)
	.then(function(user){
		//console.log("USER",user)
		if(user == null){
			console.log("RUN NULL")
			res.status(403)
			.json({err:'unauthorized'})
		}
		console.log("PASSWORD BEFORE")
		console.log(__user.password);
		console.log(user.password);

		bcrypt.compare(__user.password, user.password, function(err, result){
			console.log("PASSWORD AFTER")
			console.log(__user.password);
			console.log(user.password);
			if(result == true) {
				user.password = '';
				delete user.password;
				var user_obj = {email:user.email,id:user.id};
				var token = jwt.sign(user_obj,'dwaynetherockjohnson');
				res.set('authentication',token);
		        res.json({
		        	user:user
		        });
			} else {
				res.status(403)
					.json({err:'unauthorized'})
			}
		});
	}, function(err){
		console.log(err)
	})
});

module.exports = router;