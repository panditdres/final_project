(function(){
	angular
		.module('mapApp')
		.controller('adminCtrl',adminCtrl)

	function adminCtrl($scope, $http, $state, mapSrv, api) {
		var adminVm = this;
	
		adminVm.logInBtn	= 'Log In';
		adminVm.login = login;
		adminVm.logout = logout;

		// adminVm.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
		// adminVm.series = ['series A'];
		// adminVm.data = [
		//   [65, 59, 80, 81, 56, 55, 40]
		// ];
		
		// if(localStorage.authToken) {
		// 	$state.go('admin.dash')
		// }

		function login(){
			var payload = {
				email:adminVm.email,
				password:adminVm.password
			}
			adminVm.auth_btn = "Authorizing";
			//make api call
			api.request('/admin/login',payload,'POST')
			.then(function(res){
				console.log(res);
				//success callback
				//success code
				if(res.status == 200){
					adminVm.auth_btn = "Success";
					//user exists
					if(res.data.user.length == 0){
						adminVm.auth_btn = 'Invalid Password';	
					}
					else{
						console.log("ADMIN LOGGED IN")
						$state.go('admin.dash');
					}
				}		
			},function(err){
				//error callback
				console.log(err);
				adminVm.auth_btn = "Error";
			})
		}

		function logout(){
			console.log("ADMIN LOG OUT");
			localStorage.clear(localStorage.authToken);
			$state.go('login')
		}

		function addPlace(){
			var place = {
				name: adminVm.placeName,
				lattitude: adminVm.lattitude,
				longitude: adminVm.longitude,
				type: adminVm.tpye
			}
			// make api request
			// api.request('/place', venue, 'POST')
			// .then(function(res){
			// 	console.log(res);
			// 	if(res.status == 200){
			// 		console.log("SUCCES POSTING VENUE")
			// 	}
			// }, function(err){
			// 	console.log('err', err)
			// })
		}

	}

})();
