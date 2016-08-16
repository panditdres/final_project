(function(){
	angular
		.module('mapApp')
		.controller('adminCtrl',adminCtrl)

	function adminCtrl($scope, $http, $state, mapSrv, adminSrv, api, users, locations) {
		var adminVm = this;
	
		adminVm.logout   = logout;
		adminVm.users    = users;
		adminVm.locations = locations;
		adminVm.addLocation = addLocation;
		console.log(adminVm.locations)

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
