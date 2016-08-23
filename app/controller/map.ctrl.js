(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($scope, $state, $geolocation, uiGmapGoogleMapApi, user, users, locations, invites, mapSrv, adminSrv, $log, $uibModal, toastr) {
		var mapVm = this;

		// From resolve
		mapVm.userData 	 = user;
		mapVm.allUsers 	 = users;
		mapVm.locations  = locations;
		mapVm.friends 	 = user.friends;
		mapVm.playingAt  = user.playing;
		mapVm.allInvites = invites;
		console.log(mapVm.friends)

		// Function binding
		mapVm.editUser 			= editUser;
		mapVm.profile  			= profile;
		mapVm.settings 			= settings;
		mapVm.defaultView  		= defaultView;
		mapVm.populateMarkers 	= populateMarkers;
		mapVm.openModal 		= openModal;
		mapVm.toggleAnimations 	= toggleAnimations;
		mapVm.addFriend 		= addFriend;
		mapVm.getFriend 		= getFriend;
		mapVm.getLocation       = getLocation;
		mapVm.checkInvited		= checkInvited;

		if($state.includes('friends') == false){
			mapVm.checkInvited();
		}

		mapVm.checkMsg  = mapSrv.checkMsg();
		mapVm.interact  = mapSrv.interact;
		mapVm.userCheck = mapSrv.userCheck;

		// Renders the form inside the setting for user update
		mapVm.firstName = mapVm.userData.firstName;
		mapVm.lastName 	= mapVm.userData.lastName;
		mapVm.userName 	= mapVm.userData.username;
		mapVm.email 	= mapVm.userData.email;
		mapVm.userId 	= mapVm.userData.id;
		//console.log("ID",mapVm.userId)

		// Default values for ng-show in the template
		mapVm.showDefault  = mapSrv.showDefault;
		mapVm.showProfile  = mapSrv.showProfile;
		mapVm.showSettings = mapSrv.showSettings;
		//console.log( "SHHW DEF",mapVm.showDefault )
		mapVm.show = false;
		// Runs the default view function
		mapVm.defaultView();
		//console.log(mapVm.locations[0])
		mapVm.showSide = showSide;
		mapVm.hideSide = hideSide;
		mapVm.friendsView = friendsView;
		mapVm.notificationsView = notificationsView;

		mapVm.accept 		= accept;
		mapVm.reject 		= reject;
		mapVm.checkAccepted = checkAccepted;
		
		mapVm.animationsEnabled = true;
		mapVm.notificationLogo = false;

		mapVm.allFriends = true;
		mapVm.notificationShow = false;
		mapVm.status = 'friends';

		mapVm.getFriend();
		mapVm.getLocation();
		mapVm.checkAccepted();

		// if($state.current.name == 'home.map'){
		// 	if(mapVm.friends != null){
		// 		console.log("getFriend()")
		// 		mapVm.getFriend();
		// 	} 
		// 	if(mapVm.playingAt != null){
		// 		console.log("getLocation()")
		// 		mapVm.getLocation();
		// 	} else {
		// 		console.log("you have no friends nor locations")
		// 	}
		// }

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
				console.log("ARRAY",mapVm.allInvites.invites)
				if(mapVm.allInvites.invites[i].id === inviteId){
					mapVm.allInvites.invites[i].accepted.push(user.id)
					var index = mapVm.allInvites.invites[i].invited.indexOf(user.id);
					mapVm.allInvites.invites[i].invited.splice(index,1);
					console.log("ALL INVITES ACCEPT",mapVm.allInvites.invites[i])
					mapSrv.updateInvitation(inviteId,mapVm.allInvites.invites[i])
					.then(function(res){
						//update array
						return mapSrv.getInvite(inviteId)
					}).then(function(res){
						console.log(res)
						mapVm.allInvites.invites.push(res.invite);
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
					console.log("ALL INVITES REJECT",mapVm.allInvites.invites[i])
					mapSrv.updateInvitation(inviteId,mapVm.allInvites.invites[i])
					.then(function(res){
						mapVm.checkInvited();
					})		
				}
			}
		}
		mapVm.events = [];
		function checkAccepted(){
			console.log("checkAccepted RUNNING")
			for(var i = 0; i < mapVm.allInvites.invites.length; i++) {
				console.log("check accept",mapVm.allInvites.invites[i])
				if(mapVm.allInvites.invites[i].accepted.length != 0){
					console.log("Hello", i)
					console.log(mapVm.allInvites.invites[i].accepted)
					if(mapVm.allInvites.invites[i].accepted.includes(user.id.toString())){
						console.log("hello")
						console.log(mapVm.allInvites.invites[i])
						mapSrv.getLocationNameAccept(mapVm.allInvites.invites[i].locationId,mapVm.allInvites.invites[i].userId,mapVm.allInvites.invites[i])
						.then(function(res){
							return res;
						}).then(function(response){
							console.log(response);
							return mapSrv.getUserNameAccept(response,response.hostId,response.event)
						}).then(function(res2){
							console.log(res2);
							var eventInfo = res2;					
							mapVm.events.push(eventInfo);
							console.log(mapVm.events)
						})
					}
				}
			}
		}

		function checkInvited(){
			mapVm.notificationData = []
			mapVm.notifications = 0;
			for(var i = 0; i < mapVm.allInvites.invites.length; i++){
				if(mapVm.allInvites.invites[i].invited.includes(user.id)){
					console.log(mapVm.allInvites.invites[i])
					mapVm.notifications++
					mapSrv.getUserInvite(mapVm.allInvites.invites[i].userId,i,mapVm.allInvites.invites[i].date,mapVm.allInvites.invites[i].id)
					.then(function(res){
						return res;
					}).then(function(response){
						// console.log(response)
						return mapSrv.getLocationInvite(response.data.firstName,response.data.lastName,mapVm.allInvites.invites[response.index].locationId,response.date,response.inviteId)			
					}).then(function(res2){
						// console.log(res2)
						var data = {
							firstname: res2.firstName,
							lastname: res2.lastName,
							location: res2.location,
							date: res2.date,
							inviteId: res2.inviteId
						}
						// console.log(data)
						mapVm.notificationData.push(data);
						// console.log(mapVm.notificationData);
						toastr.info("You have a new invitation from "+ res2.firstName + ' ' + res2.lastName + ' to play at ' + res2.location.name, "Notification")
					})
				}
			}
		}

		if(mapVm.notifications != 0) {
			mapVm.notificationLogo = true;
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
			mapVm.showProfile  = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function profile(){
			mapSrv.profile();
			mapVm.showDefault  = mapSrv.showDefault;
			mapVm.showProfile  = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function settings(){
			mapSrv.settings();
			mapVm.showDefault  = mapSrv.showDefault;
			mapVm.showProfile  = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function addFriend(friendInfo){
			mapVm.friends.push(friendInfo.id)
			mapSrv.addFriend(localStorage.loginId, mapVm.friends)
		}

		function getFriend(){
			//console.log("GET FRIEND")
			//console.log(mapVm.friends)
			for(var i = 0; i < mapVm.friends.length; i++){
				//console.log("FOR LOOP")
				mapSrv.getFriend(mapVm.friends[i])
				.then(function(res){
					if(i == (mapVm.friends.length)){
						//console.log(res)
						mapVm.friendData = res;
					}				
				})
			}
			
		}

		function getLocation(){
			for(var i = 0; i < mapVm.playingAt.length; i++){
				mapSrv.getLocation(mapVm.playingAt[i])
				.then(function(res){
					//console.log(res)
					if(i == mapVm.playingAt.length){
						//console.log(res)
						mapVm.locationData = res;
					}
				})
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
			console.log(updatedUser)
			mapSrv.updateUser(updatedUser, userId)
			mapVm.defaultView();
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
					capacity: mapVm.locations[i].currCapacity,
					maxCapacity: mapVm.locations[i].maxCapacity
				}
				mapVm.map.markers.push(marker);
			}
		}

		mapVm.map = {
			center: { latitude: 43.6532, longitude: -79.3832 },
			options : {scrollwheel: false},			
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
				            "zoom": 16,
				            "window": {
				            	marker: {},
								show: false,
								option: {},
								closeClick: function(){
									this.show = false;
								}
				            },
				            "marker":{
				            	id: 0,
					            coords: {
					                latitude: place[0].geometry.location.lat(),
					                longitude: place[0].geometry.location.lng()
					            },
					            events: {
							    	click: function(marker, window, model){
					          			console.log("marker clicked");	
					          			mapVm.map.window.show  = true;
					          			console.log("Window",mapVm.map.window)
					          			mapVm.map.window.model = model;	
					          			// console.log(mapVm.map.window.model)
					          		}
					          	}
				            }
				        };
		            }
	          	}
	        },
			marker : {
			    id: 0,
			    options: { draggable: true },
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
		
		navigator.geolocation.getCurrentPosition(function(pos) {
			// console.log("POSITION", pos.coords)
		    mapVm.map.center = {
		    	latitude: pos.coords.latitude,
		    	longitude: pos.coords.longitude
		    };
		    mapVm.map.zoom = 16;
		    $scope.$apply();
		});

		mapVm.populateMarkers();

		uiGmapGoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;
			//console.log("map ready");
			//console.log(mapVm.map);	
    	});

	}

})();
