(function(){
	angular
		.module('mapApp')
		.run(['$anchorScroll', function($anchorScroll) {
		  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
		}])
		.controller('authCtrl',authCtrl)

	function authCtrl($scope, $http, $state, $interval, $anchorScroll, $location, mapSrv, authSrv, toastr) {
		var authVm = this;

		authVm.registerBtn = 'Register';
		authVm.signUpBtn   = 'Sign up';	
		authVm.logInBtn	   = 'Log In';

		authVm.register 	= register;
		authVm.authenticate = authenticate;
		authVm.adminLogin 	= adminLogin;
		authVm.scroll       = scroll;

		function register(){
			authSrv.register(authVm.firstName,authVm.lastName,authVm.username,authVm.email,authVm.password,authVm.passwordRedo)
		}

		function authenticate(){
			authSrv.authenticate(authVm.email,authVm.password)
		}

		function adminLogin(){
			authSrv.adminLogin(authVm.email,authVm.password)
		}

		function scroll(x){
			var newHash = x;
			$location.hash(x);
			$anchorScroll();
		}

		(function() {
	      // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	      if (!String.prototype.trim) {
	        (function() {
	          // Make sure we trim BOM and NBSP
	          var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	          String.prototype.trim = function() {
	            return this.replace(rtrim, '');
	          };
	        })();
	      }
	      [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
	        // in case the input is already filled..
	        if( inputEl.value.trim() !== '' ) {
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

	    $("#menu-close").click(function(e) {
	        e.preventDefault();
	        $("#sidebar-wrapper").toggleClass("active");
	    });
	    // Opens the sidebar menu
	    $("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#sidebar-wrapper").toggleClass("active");
	    });
		
	}
})();
