var models = require('../models'),
	multer = require('multer'),
	router = require('express').Router();

console.log("loading upload route")

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads');
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
router.post('/upload', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			res.send(err);
			console.log(err);
		}
		res.send('File is uploaded');
	});
});

module.exports = router;