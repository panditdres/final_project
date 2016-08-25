var models = require('./../models'),
	bcrypt	= require('bcrypt'),
	jwt		= require('jsonwebtoken'),
	router = require('express').Router();

console.log("loading users route")

//get all reviews - works
router.get('/',function(req,res){
	models.Reviews.findAll()
	.then(function(reviews){
		res.json({reviews:reviews});
	})
})

// get one review - works
router.get('/:reviewId', function(req,res){
	var where = {where:{id:req.params.reviewId}}
	models.Reviews.find(where).then(function(review){
		console.log("GET REVIEW",review)
		res.send(review);
	})
})

// delete review with click - works
router.delete('/:reviewId', function(req,res){
	var where = {where:{id:req.params.reviewId}}
	models.Reviews.find(where).then(function(review){
		console.log("Review", review)
		review.destroy();
		res.json({
			deleted: true
		})
	})
})

// add new review - works
router.post('/', function(req,res){
	console.log("Review posting onto the database");
	console.log("REQ BODY",req.body);
	var review = req.body;
	models.Reviews.create(review)
		.then(function(review){
			res.json({
				review:review
			})
		})
})

module.exports = router;