var models = require('./../models'),
	router = require('express').Router();

console.log("loading history route")

// get all history logs
router.get('/', function(req,res){
	console.log(req.body)
	models.HistoryLog.findAll()
	.then(function(history){
		res.json({history: history})
	})
})