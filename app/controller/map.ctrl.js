(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($scope, $geolocation, uiGmapGoogleMapApi, user, users, locations, mapSrv, adminSrv, $log, $uibModal) {
		var mapVm = this;

		// From resolve
		mapVm.userData = user;
		mapVm.allUsers = users;
		mapVm.locations = locations;
		mapVm.friends = user.friends;
		console.log("USER FRIENDS",user.friends)

		// Function binding
		mapVm.editUser = editUser;
		mapVm.profile  = profile;
		mapVm.settings = settings;
		mapVm.defaultView  = defaultView;
		mapVm.populateMarkers = populateMarkers;
		mapVm.openModal = openModal;
		mapVm.toggleAnimations = toggleAnimations;
		mapVm.addFriend = addFriend;

		mapVm.checkMsg = mapSrv.checkMsg();
		mapVm.interact = mapSrv.interact;
		mapVm.userCheck = mapSrv.userCheck;

		// Renders the form inside the setting for user update
		mapVm.firstName = mapVm.userData.firstName;
		mapVm.lastName = mapVm.userData.lastName;
		mapVm.userName = mapVm.userData.username;
		mapVm.email = mapVm.userData.email;
		mapVm.userId = mapVm.userData.id;
		//console.log("ID",mapVm.userId)

		// Default values for ng-show in the template
		mapVm.showDefault = mapSrv.showDefault;
		mapVm.showProfile = mapSrv.showProfile;
		mapVm.showSettings = mapSrv.showSettings;
		//console.log( "SHHW DEF",mapVm.showDefault )

		// Runs the default view function
		mapVm.defaultView();
		//console.log(mapVm.locations[0])

		mapVm.animationsEnabled = true;

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
		      	$log.info('Modal dismissed at: ' + new Date());
		    });  
		}

		function toggleAnimations(){
			mapVm.animationsEnabled = !mapVm.animationsEnabled;
		}

		function defaultView(){
			console.log("defaultView")
			mapSrv.defaultView();
			mapVm.showDefault = mapSrv.showDefault;
			mapVm.showProfile = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function profile(){
		console.log("profile")
			mapSrv.profile();
			mapVm.showDefault = mapSrv.showDefault;
			mapVm.showProfile = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function settings(){
			mapSrv.settings();
			mapVm.showDefault = mapSrv.showDefault;
			mapVm.showProfile = mapSrv.showProfile;
			mapVm.showSettings = mapSrv.showSettings;
		}

		function addFriend(friendInfo){
			console.log("user's ID",localStorage.loginId) 
			console.log("Add friend's ID",friendInfo) 
			console.log("Array friends",mapVm.friends)
			mapVm.friends.push(JSON.stringify(friendInfo))
			mapSrv.addFriend(localStorage.loginId, mapVm.friends)
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
		
		// mapVm.drawingManagerOptions = {
		//     drawingMode: google.maps.drawing.OverlayType.MARKER,
		//     drawingControl: true,
		//     drawingControlOptions: {
		//       position: google.maps.ControlPosition.TOP_CENTER,
		//         drawingModes: [
		//           google.maps.drawing.OverlayType.MARKER,
		//           google.maps.drawing.OverlayType.CIRCLE,
		//           google.maps.drawing.OverlayType.POLYGON,
		//           google.maps.drawing.OverlayType.POLYLINE,
		//           google.maps.drawing.OverlayType.RECTANGLE
		//         ]
		//     },
		//     circleOptions: {
		//       fillColor: '#ffff00',
		//         fillOpacity: 1,
		//         strokeWeight: 5,
		//         clickable: false,
		//         editable: true,
		//         zIndex: 1
		//       }
		//     };
		// mapVm.markersAndCircleFlag = true;
		// mapVm.drawingManagerControl = {};

		// $scope.$watch('markersAndCircleFlag', function() {
		//     if (!mapVm.drawingManagerControl.getDrawingManager) {
		//       return;
		//     }
		//     var controlOptions = angular.copy(mapVm.drawingManagerOptions);
		//     if (!mapVm.markersAndCircleFlag) {
		//       controlOptions.drawingControlOptions.drawingModes.shift();
		//       controlOptions.drawingControlOptions.drawingModes.shift();
		//     }
		//     mapVm.drawingManagerControl.getDrawingManager().setOptions(controlOptions);
		//   });

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
		//var geoMarker = new GeolocationMarker(mapVm.map)

		uiGmapGoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;
			console.log("map ready");
			console.log(mapVm.map);	
    	});

	}

})();
