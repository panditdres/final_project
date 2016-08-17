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
			authSrv.register(authVm.firstName,authVm.lastName,authVm.username,authVm.email,authVm.password,authVm.passwordRedo)
		}

		function authenticate(){
			console.log(authVm.email)
			console.log(authVm.password)
			authSrv.authenticate(authVm.email,authVm.password)
		}

		function adminLogin(){
			authSrv.adminLogin(authVm.email,authVm.password)
		}

	}

})();
