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
			console.log("scroll function")
			var newHash = x;
			$location.hash(x);
			$anchorScroll();
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

	    $("#menu-close").click(function(e) {
	    	console.log("close sidebar")
	        e.preventDefault();
	        $("#sidebar-wrapper").toggleClass("active");
	    });
	    // Opens the sidebar menu
	    $("#menu-toggle").click(function(e) {
	    	console.log("open sidebar")
	        e.preventDefault();
	        $("#sidebar-wrapper").toggleClass("active");
	    });
	    // Scrolls to the selected menu item on the page
	    $(function() {
	    	console.log("scrolling item")
	        $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
	            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
	                var target = $(this.hash);
	                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	                if (target.length) {
	                    $('html,body').animate({
	                        scrollTop: target.offset().top
	                    }, 1000);
	                    return false;
	                }
	            }
	        });
	    });
	    console.log(document)
	    //#to-top button appears after scrolling
	    var fixed = false;
	    $('html,body').scroll(function() {
	    	console.log("SCROLL")
	        if ($(this).scrollTop() > 250) {
	        	
	        	console.log("inside")
	            if (!fixed) {
	                fixed = true;
	                $('#to-top').css({position:'fixed', display:'block'});
	                $('#to-top').show("slow", function() {
	                    $('#to-top').css({
	                        position: 'fixed',
	                        display: 'block'
	                    });
	                });
	            }
	        } else {
	            if (fixed) {
	                fixed = false;
	                $('#to-top').hide("slow", function() {
	                    $('#to-top').css({
	                        display: 'none'
	                    });
	                });
	            }
	        }
	    });
		
	}
})();
