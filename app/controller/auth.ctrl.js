(function(){
	angular
		.module('mapApp')
		.controller('authCtrl',authCtrl)

	function authCtrl($scope, $http, $state, $interval, mapSrv, authSrv, toastr) {
		var authVm = this;

		authVm.registerBtn = 'Register';
		authVm.signUpBtn   = 'Sign up';	
		authVm.logInBtn	   = 'Log In';

		authVm.register 	= register;
		authVm.authenticate = authenticate;
		authVm.adminLogin 	= adminLogin;

		var slides = [
			"http://www.soccer.com/guide/wp-content/uploads/2015/11/E5F7DF0B-CC3D-421A-8671-82058AF70285.jpg",
			"http://img.wallpaperfolder.com/f/6703377249F6/ac-dfd-ed-xqw-emirates.jpg",
			"http://hdwallsize.com/wp-content/uploads/2013/04/Mesut-Ozil-Real-Madrid-Free-Kick-Wallpaper.jpg"
		]

		function register(){
			authSrv.register(authVm.firstName,authVm.lastName,authVm.username,authVm.email,authVm.password,authVm.passwordRedo)
		}

		function authenticate(){
			authSrv.authenticate(authVm.email,authVm.password)
		}

		function adminLogin(){
			authSrv.adminLogin(authVm.email,authVm.password)
		}
	}
})();
