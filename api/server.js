var express  	= require('express'),
  	request     = require('request'),
  	models	 	= require('./models'),
  	bodyParser  = require('body-parser'),
	app 	 	= express();

// Load the app on the server
app.use(express.static(__dirname + './../app/'));
app.use(bodyParser.json());

// Add middleware
var authentication = require('./middleware/auth')

// Applying the proper routes
var auth_route  	= require('./routes/auth');
var users_route 	= require('./routes/users');
var admin_route 	= require('./routes/admin');
var location_route 	= require('./routes/location');
//var history_route 	= require('./routes/history');
var upload_route 	= require('./routes/upload');
var invites_route   = require('./routes/invites')
var reviews_route	= require('./routes/reviews')

// Use app for the proper route
app.use('/api/auth',auth_route);
app.use('/api/users',authentication,users_route);
app.use('/api/admin',authentication,admin_route);
app.use('/api/location',authentication,location_route);
// app.use('/api/history',history_route);
app.use('/api/upload',authentication,upload_route);
app.use('/api/invites',authentication,invites_route)
app.use('/api/reviews',authentication,reviews_route)

models.sequelize.sync().then(function(){
	app.listen(8092, function(){
		console.log('Server started on http://localhost:8092');
		console.log('Press CTRL + C to stop server');
	})
})