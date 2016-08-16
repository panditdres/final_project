(function(){
	angular
		.module('mapApp')
		.controller('adminCtrl',adminCtrl)

	function adminCtrl($scope, $stateParams, $http, $state, mapSrv, adminSrv, api, users, locations) {
		var adminVm = this;
	
		adminVm.logout   = logout;
		adminVm.users    = users;
		adminVm.locations = locations;
		adminVm.addLocation = addLocation;
		adminVm.getLocation = adminSrv.getLocation;
		console.log(adminVm.locations)

		if($stateParams.locationId != undefined){
			adminSrv.getLocation($stateParams.locationId)
			.then(function(res){
				console.log(res)
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
				"type": adminVm.type
			}
			console.log("LOCATION",location)
			adminSrv.addLocation(location)
		}

		// function updateLocation(){

		// }



		

	}

})();
