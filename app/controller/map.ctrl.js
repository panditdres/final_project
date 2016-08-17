(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($scope, $geolocation, uiGmapGoogleMapApi, user, locations, mapSrv, adminSrv) {
		var mapVm = this;

		// From resolve
		mapVm.userData = user;
		mapVm.locations = locations;

		// Function binding
		mapVm.editUser = editUser;
		mapVm.profile  = profile;
		mapVm.settings = settings;
		mapVm.defaultView  = defaultView;
		mapVm.populateMarkers = populateMarkers;


		mapVm.checkMsg = mapSrv.checkMsg();
		mapVm.interact = mapSrv.interact;
		mapVm.userCheck = mapSrv.userCheck;

		// Renders the form inside the setting for user update
		mapVm.firstName = mapVm.userData.firstName;
		mapVm.lastName = mapVm.userData.lastName;
		mapVm.userName = mapVm.userData.username;
		mapVm.email = mapVm.userData.email;
		mapVm.userId = mapVm.userData.id;
		console.log("ID",mapVm.userId)

		// Default values for ng-show in the template
		mapVm.showDefault = mapSrv.showDefault;
		mapVm.showProfile = mapSrv.showProfile;
		mapVm.showSettings = mapSrv.showSettings;
		console.log( "SHHW DEF",mapVm.showDefault )

		// Runs the default view function
		mapVm.defaultView();
		console.log(mapVm.locations[0])

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
					type: mapVm.locations[i].type
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
			    coords: {
			        latitude: 43.646708,
			        longitude: -79.413697
			    },
			    options: { draggable: true },
			    
			    // events: {
			    // 	click: function(marker, window, model){
	      //     			console.log("MARKER show clicked",marker);
	      //     			console.log("before",mapVm.map.window.show)
	      //     			mapVm.map.window.show  = true;
	      //     			console.log("after",mapVm.map.window.show)
	      //     			mapVm.map.window.model = model;	
	      //     			console.log("MODEL",model)
	      //     		}
			    // }
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
	          				type: marker.model.type
	          			}
	          			console.log("MARKERS MODEL",window_model)
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
