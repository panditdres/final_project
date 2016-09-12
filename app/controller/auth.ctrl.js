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
	    // Disable Google Maps scrolling
	    // See http://stackoverflow.com/a/25904582/1607849
	    // Disable scroll zooming and bind back the click event
	    var onMapMouseleaveHandler = function(event) {
	        var that = $(this);
	        that.on('click', onMapClickHandler);
	        that.off('mouseleave', onMapMouseleaveHandler);
	        that.find('iframe').css("pointer-events", "none");
	    }
	    var onMapClickHandler = function(event) {
	            var that = $(this);
	            // Disable the click handler until the user leaves the map area
	            that.off('click', onMapClickHandler);
	            // Enable scrolling zoom
	            that.find('iframe').css("pointer-events", "auto");
	            // Handle the mouse leave event
	            that.on('mouseleave', onMapMouseleaveHandler);
	        }
	        // Enable map zooming with mouse scroll when the user clicks the map
	    $('.map').on('click', onMapClickHandler);
		
	}
})();
