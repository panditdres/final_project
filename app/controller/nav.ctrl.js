(function(){
	angular
		.module('mapApp')
		.controller('navCtrl',navCtrl)

	function navCtrl($scope, $http, $state, mapSrv) {
		navVm = this;

		navVm.checkMsg = mapSrv.checkMsg();
		navVm.interact = mapSrv.interact;
		navVm.userCheck = mapSrv.userCheck;

		navVm.message = '';

		$scope.$watch(function () { 
			return mapSrv.userId; 
		},function(newVal,oldVal){
			console.log("CHECL OCAL WATCH")
		   if(oldVal!==newVal){
		     console.log('It is undefined'); 
		     navVm.checkMsg = mapSrv.checkMsg();
		  }
		});
		
	}

})();
