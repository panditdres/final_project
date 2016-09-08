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

		(function() {
	      console.log("SCRIPT")
	      // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	      console.log("IF",String.prototype)
	      if (!String.prototype.trim) {
	        (function() {
	        console.log("going in if")
	          // Make sure we trim BOM and NBSP
	          var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	          String.prototype.trim = function() {
	            return this.replace(rtrim, '');
	          };
	        })();
	      }
	      console.log("before forEach");
	      [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
	      	console.log("forEach")
	        // in case the input is already filled..
	        if( inputEl.value.trim() !== '' ) {
	          console.log("SCRIPT FILLED")
	          classie.add( inputEl.parentNode, 'input--filled' );
	        }

	        // events:
	        inputEl.addEventListener( 'focus', onInputFocus );
	        inputEl.addEventListener( 'blur', onInputBlur );
	      } );

	      function onInputFocus( ev ) {
	        console.log("onInputFocus")
	        classie.add( ev.target.parentNode, 'input--filled' );
	      }

	      function onInputBlur( ev ) {
	        console.log("onInputBlur")
	        if( ev.target.value.trim() === '' ) {
	          classie.remove( ev.target.parentNode, 'input--filled' );
	        }
	      }
	    })();
	}
})();
