(function(){
	'use strict';

	angular
		.module('mapApp',['ui.router','uiGmapgoogle-maps','angular-jwt','ngGeolocation','ngAnimate','toastr','ui.bootstrap']);

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
						return mapSrv.getUser();
					}, 
					users: function(adminSrv){
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
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
						return mapSrv.getUser();
					}, 
					users: function(adminSrv){
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
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

			.state('friends', {
				url:'/friends',
				templateUrl:'/partials/find.friends.html',
				authenticate:true,
				controller:'mapCtrl as ctrl',
				resolve:{
					user: function(mapSrv){
						return mapSrv.getUser();
					}, 
					users: function(adminSrv){
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
					}
				}
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
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
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
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
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

			.state('admin.editLocation', {
				url:'/location/edit/:locationId',
				templateUrl:'/partials/admin.edit.location.html',
				authenticate:true,
				controller:'adminCtrl as ctrl',
				resolve:{
					locations: function(adminSrv){
						return adminSrv.getLocations();
					}
				}				
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

			// .state('admin.editUsers', {
			// 	url:'/edit/users/:userId',
			// 	templateUrl:'/partials/admin.edit.user.html',
			// 	authenticate:true,
			// 	controller:'adminCtrl as ctrl'
			// })

			$httpProvider.interceptors.push(function(jwtHelper){
				return {
					request:function(config){
						console.log('Requests');
						console.log(config);
						if(localStorage.authToken != undefined){
							config.headers.authentication = localStorage.authToken;
						}
						return config;
					},
					response:function(response){
						console.log('Response');
						var auth_token = response.headers('authentication');
						console.log(auth_token);
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