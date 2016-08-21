var models 	= require('./../models'),
	bcrypt	= require('bcrypt'),
	jwt		= require('jsonwebtoken'),
	router 	= require('express').Router();

console.log('loading auth routes')
//register a new user
router.post('/register',function(req,res){
	console.log('Registration Endpoint');
	var __user = req.body;
	console.log("Registration user", __user)

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(__user.password, salt, function(err, hash) {
	        // Store hash in your password DB.
	        if(!err){
	        	__user.password = hash;
		        	models.Users.create(__user)
		        	.then(function(user){
		        	console.log('user', user)
		        	//remove password from response
		        	user.password ='';
		        	res.json({user:user,msg:'Account Created'});
		        }).catch(function(e){
		        	console.log("ERROR line 26", e)
		        	res.json({error:e})
		        })
	        } else {
	        	console.log("ERROR line 30",err);
	        	res.json({error:err})
	        }
	    });
	});
});

router.post('/authenticate',function(req,res){
	console.log('Authentication Endpoint');
	var __user = req.body;
	console.log(__user)

	var where = {where:{email:__user.email}};
	models.Users.find(where)
	.then(function(user){
		console.log("auth user")
		if(user == null) {
			res.status(403)
		    .json({err:'wrong email'});
		}	
		bcrypt.compare(__user.password, user.password, function(err, result) {
		    // res == true 
		    console.log("PASSWORD AFTER")
			console.log(__user.password);
			console.log(user.password);
		    if(result==true){
		    	user.password = '';
		    	delete user.password;
		    	var user_obj = {email:user.email,id:user.id};
				var token = jwt.sign(user_obj,'dwaynetherockjohnson');
				console.log("Route Token", token)
				user_details = {
					email: user_obj.email,
					id: user_obj.id,
					token: token
				}
				res.set('authentication',token);
				//console.log('Authentication',res.set('authentication',token))
		    	res.json(user_details)
		    	//console.log("USER OBJ",res.json(user_obj))
		    }
		    else{
		    	res.status(403)
		    		.json({err:'wrong password'});
		    }
		});
		
	}, function(err){
		console.log(err)
	})

})

module.exports = router;