var models = require('./../models'),
	bcrypt	= require('bcrypt'),
	jwt		= require('jsonwebtoken'),
	router = require('express').Router();

console.log("loading users route")

//get all users - works
router.get('/',function(req,res){
	models.Invites.findAll()
	.then(function(invites){
		res.json({invites:invites});
	})
})

// get one user - works
router.get('/:inviteId', function(req,res){
	// console.log(req.params);
	var where = {where:{id:req.params.inviteId}}
	models.Invites.find(where).then(function(invite){
		console.log(invite)
		res.json({invite:invite});
	})
})

// delete account with click - works
router.delete('/:inviteId', function(req,res){
	// console.log("DELETE USER")
	// console.log(req.params)
	var where = {where:{id:req.params.inviteId}}
	models.Invites.find(where).then(function(invite){
		invite.destroy();
		res.json({
			deleted: true
		})
	})
})

// Update the invitations list
router.put('/:inviteId', function(req,res){
	var where = {where:{id:req.params.inviteId}}
	var __invitation = req.body;
	models.Invites.find(where).then(function(invite){
		invite.updateAttributes({
			invited: __invitation.invited,
			accepted: __invitation.accepted,
			rejected: __invitation.rejected
		});
		res.json({
			invitation:__invitation
		});
	})
})


module.exports = router;