var models = require('../models'),
	multer = require('multer'),
	router = require('express').Router();

console.log("loading upload route")

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, '/app/uploads/');
	},
	filename: function(req, file, callback) {
		var originalName = file.originalname;
		var fileExtension = originalName.split('.').slice(-1);
		originalName = originalName.split('.').slice(0,-1).join('.');

		callback(null, originalName + '-' + Date.now() + '.' + fileExtension);
	}
})

var upload = multer({storage: storage}).any();

// set up API endpoint
router.post('/', function(req, res) {
	console.log("UPLOAD REQ",req)
	console.log("UPLOAD RES",res)
	upload(req, res, function(err) {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.json(req.files[0]);
		}
	});
});

module.exports = router;