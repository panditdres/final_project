var express  	= require('express'),
  	request     = require('request'),
  	models	 	= require('./models'),
  	bodyParser  = require('body-parser'),
	app 	 	= express();

// Load the movie challenge on the server
app.use(express.static(__dirname + './../app/'));
app.use(bodyParser.json());

// Add middleware
var authentication = require('./middleware/auth')

// Applying the proper routes
var auth_route  = require('./routes/auth');
var users_route = require('./routes/users');
var admin_route = require('./routes/admin');
var place_route = require('./routes/place')

// Use app for the proper route
app.use('/api/auth',auth_route);
app.use('/api/users',authentication,users_route);
app.use('/api/admin',admin_route);
app.use('/api/place',place_route);

models.sequelize.sync().then(function(){
	app.listen(8092, function(){
		console.log('Server started on http://localhost:8092');
		console.log('Press CTRL + C to stop server');
	})
})