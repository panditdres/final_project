(function(){
	angular
		.module('mapApp')
		.controller('mapCtrl',mapCtrl)

	function mapCtrl($scope, $geolocation, uiGmapGoogleMapApi, user, mapSrv) {
		var mapVm = this;

		mapVm.userData = user;
		console.log("USER",mapVm.userData)
		mapVm.checkMsg = mapSrv.checkMsg();
		mapVm.interact = mapSrv.interact;
		mapVm.userCheck = mapSrv.userCheck;
		//mapVm.GeolocationMarker = GeolocationMarker;

		// $geolocation.watchPosition({
		// 	timeout: 60000,
		// 	maximumAge: 250,
		// 	enableHighAccuracy: true
		// })


		mapVm.map = {
			center: { latitude: 43.6532, longitude: -79.3832 },
			options : {scrollwheel: false},			
			zoom: 14,
			window : {
				marker: {},
				show: false,
				option: {},
				closeClick: function(){
					console.log("CLOSING")
					mapVm.map.window.show = false;
					return mapVm.map.window.show;
				},
			},
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
	        circle: {
	        	id: 0,
	        	center: {
	        		latitude: 43.646708,
	        		longitude: -79.413697
	        	}, 
	        	radius: 20,
	        	stroke: {
	        		color: '#51BFFF',
	        		weight: 1,
	        		opacity: 0.3
	        	},
	        	fill: {
	        		color: '#51BFFF',
	        		opacity: 0.3
	        	},
	        	visible: false
	        },
			marker : {
			    id: 0,
			    coords: {
			        latitude: 43.646708,
			        longitude: -79.413697
			    },
			    options: { draggable: true },
			    
			    events: {
			    	click: function(marker, window, model){
	          			console.log("marker show clicked");
	          			console.log("before",mapVm.map.window.show)
	          			mapVm.map.window.show  = true;
	          			console.log("after",mapVm.map.window.show)
	          			mapVm.map.window.model = model;	
	          			console.log(model)
	          		}
			    }
			},
			markers: [
				{
					id:0,				
				    latitude: 43.639110,
				    longitude: -79.423277				
				}, {
					id:1,
					latitude: 43.638582,
				    longitude: -79.396627					
				}, {
					id:2,
					latitude: 43.634576,
				    longitude: -79.398215					
				}, {
					id:3,
					latitude: 43.664758,
				    longitude: -79.421217					
				}, {
					id:4,
					latitude: 43.661730,
				    longitude: -79.395345					
				}, {
					id:5,
					latitude: 43.663024,
				    longitude: -79.317180					
				}, {
					id:6,
					latitude: 43.665089,
				    longitude: -79.313425					
				}, {
					id:7,
					latitude: 43.668483,
				    longitude: -79.328558					
				}, {
					id:8,
					latitude: 43.672927,
				    longitude: -79.450840					
				}, {
					id:9,
					latitude: 43.674727,
				    longitude: -79.452578					
				}, {
					id:10,
					latitude: 43.649435,
				    longitude: -79.467217			
				}, {
					id:11,
					latitude: 43.683629,
				    longitude: -79.408638					
				}, {
					id:12,
					latitude: 43.667970,
				    longitude: -79.479781					
				}, {
					id:13,
					latitude: 43.662403,
				    longitude: -79.409469					
				}, {
					id:14,
					latitude: 43.660867,
				    longitude: -79.418696					
				}, {
					id:15,
					latitude: 43.652361,
				    longitude: -79.420236					
				}, {
					id:16,
					latitude: 43.652292,
				    longitude: -79.421255					
				}, {
					id:17,
					latitude: 43.655103,
				    longitude: -79.371543					
				}, {
					id:18,
					latitude: 43.665752,
				    longitude: -79.358969					
				}, {
					id:19,
					latitude: 43.686226,
				    longitude: -79.388452					
				}, {
					id:20,
					latitude: 43.641710,
				    longitude: -79.408751					
				}
			],
			markersEvents: {
				click: function(marker, window, model){
	          			console.log("marker clicked markers");
	          			mapVm.map.window.show  = true;
	          			mapVm.map.window.model = model;	
	          			// console.log(mapVm.map.window.model)
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
		    mapVm.map.circle = {

		    }
		    mapVm.map.zoom = 16;
		    $scope.$apply();
		});

		//var geoMarker = new GeolocationMarker(mapVm.map)

		uiGmapGoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;
			console.log("map ready");
			console.log(mapVm.map);	
    	});

	}

})();
