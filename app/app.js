(function(){
	'use strict';

	angular
		.module('mapApp',['ui.router','uiGmapgoogle-maps','angular-jwt','ngGeolocation','ngAnimate','toastr','ui.bootstrap','ngMaterial','angular-intro']);

	angular
		.module('mapApp')
		.config(function(uiGmapGoogleMapApiProvider,$stateProvider, $httpProvider, $urlRouterProvider) {
		    uiGmapGoogleMapApiProvider.configure({
		        //    key: 'your api key',
		        v: '3.20', //defaults to latest 3.X anyhow
		        libraries: 'weather,geometry,visualization,places',
		    });
	
			$urlRouterProvider.otherwise('/');

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
					invites: function(mapSrv){
						return mapSrv.allInvites()
					},
					users: function(adminSrv){
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
					},
					reviews: function(adminSrv){
						return adminSrv.getReviews();
					}
				}
			})

			.state('home.map', {
				url:'/map',
				templateUrl:'/partials/mapTemplate.html', 
				//controller:'mapCtrl as ctrl',
				authenticate:true,
				resolve:{
					user: function(mapSrv){
						return mapSrv.getUser();
					}, 
					invites: function(mapSrv){
						return mapSrv.allInvites()
					},
					users: function(adminSrv){
						return adminSrv.getUsers();
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
					},
					reviews: function(adminSrv){
						return adminSrv.getReviews();
					}
				}
			})

			.state('login', {
				url:'/',
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

			.state('tutorial', {
				url:'/tutorial',
				templateUrl:'/partials/tutorial.html',
				authenticate:true,
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
					invites: function(mapSrv){
						return mapSrv.allInvites()
					},
					locations: function(adminSrv){
						return adminSrv.getLocations();
					},
					reviews: function(adminSrv){
						return adminSrv.getReviews();
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
					},
					reviews: function(adminSrv){
						return adminSrv.getReviews();
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

			.state('admin.allReview', {
				url:'/reviews/all',
				templateUrl:'/partials/admin.reviews.html',
				authenticate:true,
				controller:'adminCtrl as ctrl',
				resolve:{
					reviews: function(adminSrv){
						return adminSrv.getReviews();
					}
				}
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
						return adminSrv.getUsers();
					}
				}
			})

			$httpProvider.interceptors.push(function(jwtHelper){
				return {
					request:function(config){
						if(localStorage.authToken != undefined){
							config.headers.authentication = localStorage.authToken;
						}
						return config;
					},
					response:function(response){
						var auth_token = response.headers('authentication');
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

	angular
		.module('mapApp')
		.directive('fileModel', ['$parse', function ($parse) {
			return {
			    restrict: 'A',
			    link: function(scope, element, attrs) {
			        var model = $parse(attrs.fileModel);
			        var modelSetter = model.assign;

			        element.bind('change', function(){
			            scope.$apply(function(){
			                modelSetter(scope, element[0].files[0]);
			            });
			        });
			    }
			}
		}]);



})();