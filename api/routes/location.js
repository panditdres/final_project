var models = require('./../models'),
	router = require('express').Router();

console.log("loading location route")
// get all venues
router.get('/', function(req,res){
	console.log(req.body)
	models.Location.findAll()
	.then(function(locations){
		res.json({locations:locations})
	})
})

// add new location
router.post('/', function(req,res){
	console.log("Venue posting onto the database");
	console.log("REQ BODY",req.body);
	var location = req.body;
	models.Location.create(location)
		.then(function(location){
			res.json({
				location:location
			})
		})
})

// editing location
router.put('/new/:placeName', function(req,res){
	console.log("Edit Location")
	var where = {where:{}}
})

// delete location
router.delete('/new/:placeName', function(req,res){
	console.log("DELETE LOCATION")
})

module.exports = router;