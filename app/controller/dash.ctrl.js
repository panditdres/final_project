(function(){
	angular
		.module('mapApp')
		.controller('dashCtrl',dashCtrl)

	function dashCtrl($scope, $http, mapSrv, user, $stateParams) {
		var dashVm = this;

		//console.log("USER",user)
		dashVm.userData = user;

		console.log("controller working")
	}

})();
