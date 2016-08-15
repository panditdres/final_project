(function(){
	'use strict';

	angular
		.module('mapApp',['ui.router','uiGmapgoogle-maps','angular-jwt','ngGeolocation','ngAnimate','toastr']);

	angular
		.module('mapApp')
		.config(function(uiGmapGoogleMapApiProvider,$stateProvider, $httpProvider, $urlRouterProvider) {
		    uiGmapGoogleMapApiProvider.configure({
		        //    key: 'your api key',
		        v: '3.20', //defaults to latest 3.X anyhow
		        libraries: 'weather,geometry,visualization,places',
		    });
	
			$urlRouterProvider.otherwise('/login');

			$stateProvider

			.state('home', {
				url:'/home',
				templateUrl:'/partials/map.main.html',
				controller:'mapCtrl as ctrl',
				authenticate:true,
				resolve:{
					user: function(mapSrv){
						//console.log("State Params:",$stateParams.userId)
						return mapSrv.getUser();
					}
				}
			})

			.state('home.map', {
				url:'/map',
				templateUrl:'/partials/mapTemplate.html', 
				controller:'mapCtrl as ctrl',
				authenticate:true,
				resolve:{
					user: function(mapSrv){
						//console.log("State Params:",$stateParams.userId)
						return mapSrv.getUser();
					}
				}
			})

			.state('login', {
				url:'/login',
				templateUrl:'/partials/logIn.html',
				authenticate:false,
				controller:'authCtrl as ctrl'
			})

			.state('register', {
				url:'/register',
				templateUrl:'/partials/register.html',
				authenticate:false,
				controller:'authCtrl as ctrl'
			})

			.state('adminAuth', {
				url:'/adminAuth',
				templateUrl:'/partials/adminAuth.html',
				authenticate:false,
				controller:'authCtrl as ctrl'
			})

			.state('admin', {
				url:'/admin',
				templateUrl:'/partials/admin.html',
				controller:'adminCtrl as ctrl',
				authenticate:true,
				resolve:{
					users: function(adminSrv){
						//console.log("State Params:",$stateParams.userId)
						return adminSrv.getUsers();
					}
				}
			})

			.state('admin.dash', {
				url:'/dash',
				templateUrl:'/partials/admin.dash.html',
				controller:'adminCtrl as ctrl',
				authenticate:true,
				resolve:{
					users: function(adminSrv){
						//console.log("State Params:",$stateParams.userId)
						return adminSrv.getUsers();
					}
				}
			})

			.state('admin.addLocation', {
				url:'/location',
				templateUrl:'/partials/admin.venue.html',
				authenticate:true,
				controller:'adminCtrl as ctrl'
			})

			.state('admin.allLocation', {
				url:'/location/all',
				templateUrl:'/partials/admin.location.html',
				authenticate:true,
				controller:'adminCtrl as ctrl'
			})

			.state('admin.allUsers', {
				url:'/users',
				templateUrl:'/partials/admin.user.html',
				authenticate:true,
				controller:'adminCtrl as ctrl',
				resolve:{
					users: function(adminSrv){
						//console.log("State Params:",$stateParams.userId)
						return adminSrv.getUsers();
					}
				}
			})

			$httpProvider.interceptors.push(function(jwtHelper){
				return {
					request:function(config){
						console.log('Requests');
						/*
						config is the global object that the data
						is attached to, its console logged below 
						so you can see it
						*/
						console.log(config);

						/*
						here we check if a the authoken is saved in 
						localStorage, and if is, it is attached to the
						outbound header to be sent off wherever
						it needs to go
						*/
						if(localStorage.authToken != undefined){
							config.headers.authentication = localStorage.authToken;
						}
						return config;
					},
					response:function(response){
						console.log('Response');
						/*
						the incoming response object is intercepted here
						and its header is checked for an authentication 
						property. This property was attached by our own api
						and it contains the Json Web Token
						*/
						var auth_token = response.headers('authentication');
						console.log(auth_token);
						/*
						if there is a web token it is decoded below to check
						the payload. In this case we are checking that it contains
						an email property, becase that is set by our API when the
						user logs in. If it does, we know that this token did 
						come from our api and we store it in localStorage.
						The reason it is stored is because in order to access
						other parts of the API data, our server will require that
						all inbound requests it recieves (re the code above), contains
						a valid token so that it can TRUST the client requesting
						the data has been authorized at some point. In this case, 
						an authorization key in the form of JWT is passed when the
						user authenticates as part of logging in
						*/
						if(auth_token){
							var decrypt_token = jwtHelper.decodeToken(auth_token);
							console.log(decrypt_token);
							if(decrypt_token.email){
								localStorage.authToken = auth_token;
							}
							
						}
						return response;
					}
				}
			})
		});
	
	angular
		.module('mapApp')
		.run(function($rootScope,$state,authSrv){
			$rootScope.$on("$stateChangeStart", function(event,toState,toParams,fromState,fromParams){
				if(toState.authenticate && !localStorage.authToken){
					$state.transitionTo('login');
					event.preventDefault();
				}
			})
		})


})();