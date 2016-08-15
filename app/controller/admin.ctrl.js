(function(){
	angular
		.module('mapApp')
		.controller('adminCtrl',adminCtrl)

	function adminCtrl($scope, $http, $state, mapSrv, adminSrv, api, users) {
		var adminVm = this;
	
		adminVm.logout   = logout;
		adminVm.users    = users;
		console.log(adminVm.users)

		function logout(){
			console.log("ADMIN LOG OUT");
			localStorage.clear(localStorage.authToken);
			$state.go('login')
		}

		function addLocation(){
			console.log("ADDING LOCATION")
		}

		

	}

})();
