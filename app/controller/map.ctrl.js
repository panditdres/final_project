(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($scope, $state, $geolocation, uiGmapGoogleMapApi, user, users, locations, mapSrv, adminSrv, $log, $uibModal) {
		var mapVm = this;

		console.log(mapVm.mytime)
		mapVm.mytime = new Date();

  		mapVm.hstep = 1;
  		mapVm.mstep = 15;

  		mapVm.ismeridian = true

  		  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

		// From resolve
		mapVm.userData 	= user;
		mapVm.allUsers 	= users;
		mapVm.locations = locations;
		mapVm.friends 	= user.friends;
		mapVm.playingAt = user.playing;

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

		mapVm.animationsEnabled = true;

		if($state.current.name == 'home.map'){
			if(mapVm.friends != null){
				console.log("getFriend()")
				mapVm.getFriend();
			} 
			if(mapVm.playingAt != null){
				console.log("getLocation()")
				mapVm.getLocation();
			} else {
				console.log("you have no friends nor locations")
			}
		}



		function showSide(){
			mapVm.show = true;
		}

		function hideSide(){
			mapVm.show = false;
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
			console.log("defaultView")
			mapSrv.defaultView();
			mapVm.showDefault  = mapSrv.showDefault;
			mapVm.showProfile  = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function profile(){
		console.log("profile")
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
			console.log("get friend")
			if(!mapSrv.friendDone){
				for(var i = 0; i < mapVm.friends.length; i++){
					mapSrv.getFriend(mapVm.friends[i])
					.then(function(res){
						if(i == (mapVm.friends.length)){
							mapVm.friendData = res;
						}				
					})
				}
			}
		}

		function getLocation(){
			console.log("get location")
			for(var i = 0; i < mapVm.playingAt.length; i++){
				mapSrv.getLocation(mapVm.playingAt[i])
				.then(function(res){
					console.log(res)
					if(i == mapVm.playingAt.length){
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
			console.log("POSITION", pos.coords)
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
			console.log("map ready");
			console.log(mapVm.map);	
    	});

	}

})();
