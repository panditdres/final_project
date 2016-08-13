var models = require('./../models'),
	router = require('express').Router();

console.log("loading venue route")
// get all venues
router.get('/', function(req,res){
	models.Place.findAll()
	.then(function(places){
		res.json({places:places})
	})
})

// // add new venue
router.post('/', function(req,res){
	console.log("Venue posting onto the database");
	//var __place = req.body;
	console.log("ROUTE VENUE", req.body)
})