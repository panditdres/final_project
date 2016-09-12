(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($http, $scope, $state, $geolocation, uiGmapGoogleMapApi, user, users, locations, invites, reviews, mapSrv, adminSrv, authSrv, $log, $uibModal, toastr) {
		var mapVm = this;

		// From resolve
		mapVm.userData 	 		= user;
		mapVm.allUsers 	 		= users;
		mapVm.locations  		= locations;
		mapVm.friends 	 		= user.friends;
		mapVm.friendRequestFrom = user.friendRequestFrom;
		mapVm.playingAt  		= user.playing;
		mapVm.allInvites 		= invites;
		mapVm.allReviews		= reviews;
		console.log("MAP CTRL LOAD")
		// console.log(mapVm.allReviews)

		// Function binding
		mapVm.upload 			= upload;
		mapVm.editUser 			= editUser;
		mapVm.settings 			= settings;
		mapVm.defaultView  		= defaultView;
		mapVm.populateMarkers 	= populateMarkers;
		mapVm.openModal 		= openModal;
		mapVm.toggleAnimations 	= toggleAnimations;
		mapVm.addFriend 		= addFriend;
		mapVm.friendRequest		= friendRequest
		mapVm.getFriend 		= getFriend;
		mapVm.getLocation       = getLocation;
		mapVm.checkInvited		= checkInvited;
		mapVm.checkFriends      = checkFriends;

		mapVm.checkMsg  = mapSrv.checkMsg();
		mapVm.interact  = mapSrv.interact;
		mapVm.userCheck = mapSrv.userCheck;

		console.log(mapVm.userData)
		// Renders the form inside the setting for user update
		mapVm.firstName = mapVm.userData.firstName;
		mapVm.lastName 	= mapVm.userData.lastName;
		mapVm.userName 	= mapVm.userData.username;
		mapVm.email 	= mapVm.userData.email;
		mapVm.userId 	= mapVm.userData.id;

		// Default values for ng-show in the template
		mapVm.showDefault  = mapSrv.showDefault;
		mapVm.showSettings = mapSrv.showSettings;
		mapVm.show = false;
		// Runs the default view function
		mapVm.defaultView();

		mapVm.showSide 			= showSide;
		mapVm.hideSide 			= hideSide;
		mapVm.friendsView 		= friendsView;
		mapVm.notificationsView = notificationsView;

		mapVm.accept 		= accept;
		mapVm.reject 		= reject;
		mapVm.checkAccepted = checkAccepted;
		mapVm.notifyAccept	= notifyAccept;

		mapVm.okayAccept	= okayAccept;
		
		mapVm.animationsEnabled = true;
		mapVm.notificationLogo 	= false;

		mapVm.allFriends 		= true;
		mapVm.notificationShow  = false;
		mapVm.status 			= 'friends';

		mapVm.friendMessage = "Add Friend"
		
		mapVm.eventShow = true;

		mapVm.showAccepted = true;

		mapVm.getFriend();
		mapVm.getLocation();
		mapVm.checkAccepted();	
		
		if($state.includes('friends') == false){
			mapVm.checkInvited();
			mapVm.notifyAccept()
		}

		if($state.includes('friends') == true){
			mapVm.checkFriends();
		}

		function upload(){
			var fileName = mapVm.file;
			mapSrv.upload(fileName,user.id)
		}

		function showSide(){
			mapVm.show = true;
			mapVm.notificationLogo = false;
		}

		function hideSide(){
			mapVm.show = false;
		}

		function friendsView(){
			mapVm.status = 'friends';
			mapVm.allFriends = true;
			mapVm.notificationShow = false;
		}

		function notificationsView(){
			mapVm.status = 'notifications';
			mapVm.allFriends = false;
			mapVm.notificationShow = true;
		}

		function accept(inviteId){
			console.log(inviteId)
			for(var i = 0; i < mapVm.allInvites.invites.length; i++){
				if(mapVm.allInvites.invites[i].id === inviteId){
					mapVm.allInvites.invites[i].accepted.push(user.id)
					var index = mapVm.allInvites.invites[i].invited.indexOf(user.id);
					mapVm.allInvites.invites[i].invited.splice(index,1);
					mapSrv.updateInvitation(inviteId,mapVm.allInvites.invites[i])
					.then(function(res){
						return mapSrv.allInvites()
					}).then(function(res){
						console.log(res)
						console.log(mapVm.allInvites.invites)
						mapVm.allInvites.invites = res.invites;
						mapVm.checkAccepted();
						mapVm.checkInvited();
					})
				}
			}
		}

		function reject(inviteId){
			console.log(inviteId)
			for(var i = 0; i < mapVm.allInvites.invites.length; i++){
				if(mapVm.allInvites.invites[i].id === inviteId){					
					mapVm.allInvites.invites[i].rejected.push(user.id);
					var index = mapVm.allInvites.invites[i].invited.indexOf(user.id);
					mapVm.allInvites.invites[i].invited.splice(index,1);
					mapSrv.updateInvitation(inviteId,mapVm.allInvites.invites[i])
					.then(function(res){
						mapVm.checkInvited();
					})		
				}
			}
		}
		
		function checkAccepted(){
			mapVm.events = [];
			var counter = 0;
			for(var i = 0; i < mapVm.allInvites.invites.length; i++) {
				if(mapVm.allInvites.invites[i].accepted.length != 0){
					if(mapVm.allInvites.invites[i].accepted.includes(user.id.toString())){
						mapSrv.getLocationNameAccept(mapVm.allInvites.invites[i].locationId,mapVm.allInvites.invites[i].userId,mapVm.allInvites.invites[i])
						.then(function(res){
							return res;
						}).then(function(response){
							return mapSrv.getUserNameAccept(response,response.hostId,response.event)
						}).then(function(res2){
							var eventInfo = res2;			
							mapVm.events.push(eventInfo);
							mapVm.eventShow = false;
						})
					}
				}
			}
			if(mapVm.events.length == 0){
				mapVm.eventShow = true;
			}
		}

		function checkInvited(){
			mapVm.notificationData = []
			mapVm.notifications = 0;
			for(var i = 0; i < mapVm.allInvites.invites.length; i++){
				//console.log(mapVm.allInvites.invites[i])
				//console.log(user.id)
				if(mapVm.allInvites.invites[i].userId == user.id){
					//console.log(mapVm.allInvites.invites[i])
					var acceptedArr = mapVm.allInvites.invites[i];
					for(var j =0; j < acceptedArr.accepted.length; j++){
						mapVm.notifications++
					}
				}
				if(mapVm.allInvites.invites[i].invited.includes(user.id)){
					mapVm.notifications++
					mapSrv.getUserInvite(mapVm.allInvites.invites[i].userId,i,mapVm.allInvites.invites[i].date,mapVm.allInvites.invites[i].id)
					.then(function(res){
						return res;
					}).then(function(response){
						return mapSrv.getLocationInvite(response.data.firstName,response.data.lastName,mapVm.allInvites.invites[response.index].locationId,response.date,response.inviteId)			
					}).then(function(res2){
						var data = {
							firstname: res2.firstName,
							lastname: res2.lastName,
							location: res2.location,
							date: res2.date,
							inviteId: res2.inviteId
						}
						mapVm.notificationData.push(data);
					})
				}
			}
			return mapVm.notifications;
		}
		console.log(mapVm.notifications)
		if(mapVm.notifications != 0 && $state.includes('friends') == false){
			toastr.info("You have " + mapVm.notifications + " new notifications")
		}

		function notifyAccept(){
			console.log(mapVm.events)
			mapVm.acceptedData = []
			for(var i = 0; i < mapVm.allInvites.invites.length; i++){
				//console.log(mapVm.allInvites.invites[i])
				if(mapVm.allInvites.invites[i].userId == user.id){
					//console.log(mapVm.allInvites.invites[i].accepted)
					var acceptedArr = mapVm.allInvites.invites[i];
					for(var j =0; j < acceptedArr.accepted.length; j++){
						//console.log(acceptedArr.accepted[j])
						mapSrv.notifyGetUser(acceptedArr,acceptedArr.accepted[j])
						.then(function(res){
							//console.log(res)
							return mapSrv.notifyGetLocation(res.array,res.res,res.array.locationId)
						}).then(function(res){
							mapVm.acceptedData.push(res);
							return mapVm.acceptedData;
						})
					}			
				}
			}
		}

		console.log("Accepted Data",mapVm.acceptedData)

		// Think about it, see how you can reduce notifications
		// after pressing the sweet button
		// Also, after someone accepts, you should be able to
		// see in your OWN events
		function okayAccept(acceptedUserId){
			console.log("okayAccept")
			console.log(acceptedUserId)
			console.log(mapVm.acceptedData)
			for(var i = 0; i < mapVm.acceptedData.length; i++){
				if(mapVm.acceptedData[i].user.data.id == acceptedUserId){
					mapVm.acceptedData.splice(i,1)
					console.log(mapVm.acceptedData.length)
				}	
			}
		}

		if(mapVm.notifications != 0) {
			mapVm.notificationLogo = true;
		}
				
		function checkFriends(){
			mapVm.nonFriends = [];
			for(var i = 0; i < users.length; i++){
				if(!(user.friends.includes(users[i].id.toString()) || user.id == users[i].id )){
					mapVm.nonFriends.push(users[i])
				}
			}
		}

		function openModal(size,name,type,id,capacity,max,address,players){
			var modalInstance = $uibModal.open({
		      	animation: mapVm.animationsEnabled,
		      	templateUrl: 'myModalContent.html',
		      	controller: 'ModalInstanceCtrl as ctrl',
		      	size: size,
		      	resolve: {
		      		user: function(){
		      			return mapVm.userData;
		      		},
		      		friends: function(){
		      			return mapVm.friendData;
		      		},
		      		users: function(adminSrv){
		      			return adminSrv.getUsers();
		      		},
		      		locations: function(adminSrv){
		      			return adminSrv.getLocations();
		      		},
		      		reviews: function(){
		      			return mapVm.allReviews;
		      		},
		      		locationAddress: function(){
		      			return address;
		      		},
		      		locationCapacity: function(){
		      			return capacity;
		      		},
		      		maxCapacity: function(){
		      			return max;
		      		},
		      		locationPlayers: function(){
		      			return players
		      		},
		        	locationName: function () {
		          		return name;
		        	}, 
		        	locationType: function(){
		        		return type;
		        	},  
		        	locationId: function(){
		        		return id;
		        	}
		      	}
		    });
		    modalInstance.result.then(function (selectedItem) {
		      	mapVm.selected = selectedItem;
		    },function () {
		    	console.log(mapVm.playingAt)
		    	console.log("closed modal")
		    	mapVm.getLocation()
		      	$log.info('Modal dismissed at: ' + new Date());
		    });  
		}

		function toggleAnimations(){
			mapVm.animationsEnabled = !mapVm.animationsEnabled;
		}

		function defaultView(){
			mapSrv.defaultView();
			mapVm.showDefault  = mapSrv.showDefault;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function settings(){
			mapSrv.settings();
			mapVm.showDefault  = mapSrv.showDefault;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function addFriend(friendInfo){
			toastr.success("Nice! You have added a new friend","Success")
			mapVm.friends.push(friendInfo.id)
			mapSrv.addFriend(localStorage.loginId, mapVm.friends)
			mapVm.checkFriends();
		}

		function friendRequest(friendInfo){
			console.log("friend request")
			console.log(mapVm.friendRequestFrom)
			console.log(typeof friendInfo.id)
			mapVm.friendRequestFrom.push(friendInfo.id)
			mapSrv.friendRequest(localStorage.loginId, mapVm.friendRequestFrom)
		}

		function getFriend(){
			for(var i = 0; i < mapVm.friends.length; i++){
				mapSrv.getFriend(mapVm.friends[i])
				.then(function(res){
					if(i == (mapVm.friends.length)){
						mapVm.friendData = res;
					}				
				})
			}	
		}

		function getLocation(){
			console.log("getLocation")
			if(mapVm.playingAt.length == 0) {
				mapVm.locationData = []
			} else {
				for(var i = 0; i < mapVm.playingAt.length; i++){
					mapSrv.getLocation(mapVm.playingAt[i])
					.then(function(res){
						console.log("response",res)
						//if(i == mapVm.playingAt.length){
						mapVm.locationData = res;
						console.log(mapVm.locationData)
						//}
					})
				}
			}
		}

		function editUser(userId) {
			console.log("UPDATE USER")
			var updatedUser = {
				firstName: mapVm.firstName,
				lastName: mapVm.lastName,
				username: mapVm.userName,
				email: mapVm.email,
				oldPassword: mapVm.oldPassword,
				newPassword: mapVm.newPassword
			}
			mapSrv.updateUser(updatedUser, userId)
		}

		function populateMarkers(){
			for (var i = 0; i < mapVm.locations.length; i++){
				marker = {
					id: mapVm.locations[i].id,
					latitude: mapVm.locations[i].latitude,
					longitude: mapVm.locations[i].longitude,
					name: mapVm.locations[i].name,
					address: mapVm.locations[i].address,
					type: mapVm.locations[i].type,
					players: mapVm.locations[i].players,
					maxCapacity: mapVm.locations[i].maxCapacity
				}
				mapVm.map.markers.push(marker);
			}
		}

		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log("POSITION", pos.coords)
		    mapVm.map.center = {
		    	latitude: pos.coords.latitude,
		    	longitude: pos.coords.longitude
		    };
		    mapVm.map.zoom = 16;
		    $scope.$apply();
		});

		mapVm.styleArray = [ //any style array defined in the google documentation you linked
		  {
		    featureType: "all",
		    stylers: [
		      { saturation: -80 }
		    ]
		  },{
		    featureType: "road.arterial",
		    elementType: "geometry",
		    stylers: [
		      { hue: "#00ffee" },
		      { saturation: 50 }
		    ]
		  },{
		    featureType: "poi.business",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
		  }
		];

		mapVm.map = {
			center: { latitude: 43.6532, longitude: -79.3832 },
			options : {
				scrollwheel: false,
				styles: mapVm.styleArray
			},			
			zoom: 14,
			searchbox : { 
	          	template:'searchbox.tpl.html', 
	          	events:{
		            places_changed: function (searchBox){
		            	var place = searchBox.getPlaces();
				        if (!place || place == 'undefined' || place.length == 0) {
				            console.log('no place data :(');
				            return;
				        }
				        mapVm.map = {
				            "center": {
				                "latitude": place[0].geometry.location.lat(),
				                "longitude": place[0].geometry.location.lng()
				            },
				            "zoom": 14,
				            "marker":{
				            	id: 0,
					            options: {draggable: false}
				            },
				            "markers": mapVm.map.markers,
				            "markersEvents": {
								click: function(marker, window, model){
					          			console.log("marker clicked MARKERS", marker);
					          			console.log("MARKERS COORDS LAT", marker.position.lat());
					          			var window_model = {
					          				id: marker.key,
					          				latitude: marker.position.lat(),
					          				longitude: marker.position.lng(),
					          				name: marker.model.name,
					          				address: marker.model.address,
					          				type: marker.model.type,
					          				players: marker.model.players,
					          				capacity: marker.model.capacity,
					          				maxCapacity: marker.model.maxCapacity
					          			}
					          			mapVm.openModal('sm',window_model.name,window_model.type,window_model.id,window_model.capacity,window_model.maxCapacity,window_model.address,window_model.players);
					          			console.log("MARKERS MODEL",window_model);
					          	}
							}
				        };
		            }
	          	}
	        },
			marker : {
			    id: 0,
			    options: { draggable: false },
			},
			markers: [],
			markersEvents: {
				click: function(marker, window, model){
	          			console.log("marker clicked MARKERS", marker);
	          			console.log("MARKERS COORDS LAT", marker.position.lat());
	          			var window_model = {
	          				id: marker.key,
	          				latitude: marker.position.lat(),
	          				longitude: marker.position.lng(),
	          				name: marker.model.name,
	          				address: marker.model.address,
	          				type: marker.model.type,
	          				players: marker.model.players,
	          				capacity: marker.model.capacity,
	          				maxCapacity: marker.model.maxCapacity
	          			}
	          			mapVm.openModal('sm',window_model.name,window_model.type,window_model.id,window_model.capacity,window_model.maxCapacity,window_model.address,window_model.players);
	          			console.log("MARKERS MODEL",window_model);
	          	}
			}
		};

		mapVm.populateMarkers();

		uiGmapGoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;	
    	});

		introJs().start();

		mapVm.CallMe = authSrv.CallMe

	    $scope.CompletedEvent = function () {
        	console.log("Completed Event called");
	    };

	    $scope.ExitEvent = function () {
	        console.log("Exit Event called");
	    };

	    $scope.ChangeEvent = function (targetElement) {
	        console.log("Change Event called");
	        console.log(targetElement);
	    };

	    $scope.BeforeChangeEvent = function (targetElement) {
	        console.log("Before Change Event called");
	        console.log(targetElement);
	    };

	    $scope.AfterChangeEvent = function (targetElement) {
	        console.log("After Change Event called");
	        console.log(targetElement);
	    };

	    $scope.IntroOptions = {
	        steps:[
	        {
	            element: '#step1',
	            intro: "This is your navigation bar. You can start searching for friends and under your name, you can change your settings and log out",
	        	position: 'right'
	        },
	        {
	            element: '#step2',
	            intro: "This area will show you the events that you have accepted from your friends' invitations. It will also let you know where you decided to play after pressing 'Let's Play' at a particular location",
	            position: 'right'
	        },
	        {
	            element: '#step3',
	            intro: "Geolocate will allow you to see the nearest fields to you no matter your current location",
	            position: 'right'
	        },
	        {
	            element: '#step4',
	            intro: "This button allows you to see all your friends and new notifications that you may have missed while being away",
	            position: 'left'
	        },
	        {
	            element: '#step5',
	            intro: 'You can start using the application by pressing one of the markers. It will allow you to see who is playing there, the type of field that it is and the address'
	        }
	        ],
	        showStepNumbers: false,
	        showBullets: false,
	        exitOnOverlayClick: true,
	        exitOnEsc:true,
	        nextLabel: '<strong>NEXT!</strong>',
	        prevLabel: '<span style="color:green">Previous</span>',
	        skipLabel: 'Exit',
	        doneLabel: 'Thanks'
	    };
	}

})();
