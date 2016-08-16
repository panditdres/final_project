(function(){
	angular
		.module('mapApp')
		.controller('authCtrl',authCtrl)

	function authCtrl($scope, $http, $state, mapSrv, authSrv, toastr) {
		var authVm = this;

		authVm.registerBtn = 'Register';
		authVm.signUpBtn   = 'Sign up';	
		authVm.logInBtn	   = 'Log In';

		authVm.register = register;
		authVm.authenticate = authenticate;
		authVm.adminLogin = adminLogin;

		function register(){
			authSrv.register(authVm.firstName,authVm.lastName,authVm.email,authVm.password,authVm.passwordRedo)
		}

		function authenticate(){
			console.log(authVm.email)
			console.log(authVm.password)
			authSrv.authenticate(authVm.email,authVm.password)
		}

		function adminLogin(){
			authSrv.adminLogin(authVm.email,authVm.password)
		}

		function formCheck(){
			if (authVm.firstName = ''){
				toastr.error("Please fill in your first name","Error")
			} else if (authVm.lastName = ''){
				toastr.error("Please fill in your last name","Error")
			} else if (authVm.email = ''){
				toastr.error("Please fill in your email","Error")
			} else if (authVm.password != authVm.passwordRedo){
				toastr.error("Passwords are not matching","Error")
			}
		}
	}

})();
