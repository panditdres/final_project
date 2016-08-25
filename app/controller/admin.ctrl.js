(function(){
	angular
		.module('mapApp')
		.controller('adminCtrl',adminCtrl)

	function adminCtrl($scope, $stateParams, $http, $state, mapSrv, adminSrv, api, users, locations, reviews) {
		var adminVm = this;

		adminVm.logout         = logout;
		adminVm.users          = users;
		adminVm.locations      = locations;
		adminVm.reviews		   = reviews;
		adminVm.addLocation    = addLocation;
		adminVm.getLocation    = adminSrv.getLocation;
		adminVm.deleteLocation = adminSrv.deleteLocation;
		adminVm.deleteUser 	   = adminSrv.deleteUser;
		adminVm.updateLocation = updateLocation;
		adminVm.editLocation   = editLocation;
		adminVm.getLocation	   = getLocation;
		adminVm.deleteReview   = deleteReview;

		adminVm.location   = adminSrv.location;
		adminVm.locationId = $stateParams.locationId;

		console.log(reviews)

		if($stateParams.locationId != undefined){
			adminSrv.getLocation($stateParams.locationId)
			.then(function(res){
				// console.log(res)
				adminVm.placeName  = res.location.name;
				adminVm.latitude   = res.location.latitude;
				adminVm.longitude  = res.location.longitude;
				adminVm.address    = res.location.address;
				adminVm.type	   = res.location.type;	
				adminVm.capacity   = res.location.maxCapacity;
			}, function(err){
				console.log(err)
			})
		}

		function goToLocation(id){
			adminSrv.getLocation(id)
			.then(function(res){
				console.log(res)
			})
		}

		function getLocation(id){
			console.log("GET LOCATION")
			adminSrv.getLocation(id);
		}

		function editLocation(location){
			$state.go('admin.editLocation', {locationId:location.id})
		}

		function updateLocation(locationId){
			var updated_Location = {
				"name": adminVm.placeName,
				"latitude": adminVm.latitude,
				"longitude": adminVm.longitude,
				"address": adminVm.address,
				"type": adminVm.type,
				"maxCapacity": adminVm.capacity
			}
			adminSrv.updateLocation(updated_Location, locationId)
			$state.go('admin.allLocation');
		}

		function logout(){
			console.log("ADMIN LOG OUT");
			localStorage.clear(localStorage.authToken);
			$state.go('login')
		}

		function addLocation(){
			console.log("ADDING LOCATION")
			var location = {
				"name": adminVm.placeName,
				"latitude": adminVm.latitude,
				"longitude": adminVm.longitude,
				"address": adminVm.address,
				"type": adminVm.type,
				"maxCapacity": adminVm.capacity
			}
			adminSrv.addLocation(location)
		}

		function deleteReview(reviewId){
			console.log("delete review",reviewId)
			adminSrv.deleteReview(reviewId)
		}
	}

})();
