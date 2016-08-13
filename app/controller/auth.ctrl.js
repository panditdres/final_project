(function(){
	angular
		.module('mapApp')
		.controller('authCtrl',authCtrl)

	function authCtrl($scope, $http, $state, mapSrv, toastr) {
		var authVm = this;

		authVm.registerBtn = 'Register';
		authVm.signUpBtn   = 'Sign up';	
		authVm.logInBtn	   = 'Log In';

		authVm.register = register;
		authVm.authenticate = authenticate;
		//authVm.logInInfo = mapSrv.logInInfo;

		function register(){
			//check passwords
			console.log('register run')
			if(authVm.password == authVm.passwordRedo && authVm.password != ''){
				var user = {
					firstName:authVm.firstName,
					lastName:authVm.lastName,
					email:authVm.email,
					password:authVm.password
				}
				user = JSON.stringify(user);
				$http.post('/api/auth/register',user)
				.then(function(res){
					console.log(res.data);
					if(res.data.error){
						toastr.error("Please have a unique E-Mail","Error")
						//alert("PLEASE HAVE UNIQUE EMAIL");
						//localStorage.clear(res.data);
						$state.go('register');
					} else {
						toastr.success("Account created","Success")
						authVm.authenticate();
						authVm.signUpBtn = res.data.msg;
						mapSrv.checkMsg();
						$state.go('home.map');
					}
				})
			}
			else{
				authVm.signUpBtn = "Passwords Don't Match";
			}
		}

		function authenticate(){
			console.log("authenticate is running the function")
			var user = {
				email:authVm.email,
				password:authVm.password
			}
			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){
				console.log("RESPONSE",res);		
				//mapSrv.logInInfo = res.data;
				localStorage.loginId = res.data.id;
				localStorage.loginEmail = authVm.email;
				authVm.logInBtn = res.data.msg;
				mapSrv.checkMsg();
				$state.go('home.map')
			})
		}

	}

})();
