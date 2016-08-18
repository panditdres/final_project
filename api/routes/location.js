var models = require('./../models'),
	router = require('express').Router();

console.log("loading location route")
// get all location - works
router.get('/', function(req,res){
	console.log(req.body)
	models.Location.findAll()
	.then(function(locations){
		res.json({locations:locations})
	})
})

router.get('/capacity', function(req,res){
	console.log("CAPACITY",req.body)
	models.Location.findAll()
	.then(function(locations){
		//console.log("LOCATIONS",locations)
		res.json({locations:locations})
	})
})

router.put('/capacity/:locationId', function(req,res){
	console.log(req.params.locationId)
	console.log(req.params)
	var where = {where:{id:req.params.locationId}}
	var __location = req.body;
	console.log("CAPACITY LOCATION",__location)
	models.Location.find(where).then(function(location){
		location.updateAttributes({
			currCapacity: __location.capacity
		});
		res.json({
			location:__location
		})
	})
})

// get one location - works
router.get('/:locationId', function(req,res){
	console.log("GET ONE LOCATION",req.params);
	var where = {where:{id:req.params.locationId}};
	console.log(where)
	models.Location.find(where).then(function(location){
		console.log("RESPONSE", location)
		res.json({location:location})
 	})
})

// add new location - works
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

// editing location - works
router.put('/update/:locationId', function(req,res){
	console.log("Edit Location")
	var where = {where:{id:req.params.locationId}}
	var __location = req.body;
	console.log("__LOCATION", req.body)
	models.Location.find(where).then(function(location){
		console.log(__location.maxCapacity)
		location.updateAttributes({
			name: __location.name,
			latitude: __location.latitude,
			longitude: __location.longitude,
			type: __location.type,
			maxCapacity: __location.maxCapacity
		});
		__location.id = req.params.locationId;
		res.json({
			location:__location
		})
	})
})

// delete location - works
router.delete('/:locationId', function(req,res){
	console.log("DELETE LOCATION")
	var where = {where:{id:req.params.locationId}}
	models.Location.find(where).then(function(location){
		location.destroy();
		res.json({
			deleted: true
		})
	})
})

module.exports = router;