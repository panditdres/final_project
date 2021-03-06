(function(){

	angular
		.module('mapApp')
		.service('authSrv', authSrv)

	function authSrv($http, $state, api, mapSrv, toastr){
		var self = this;

		self.register 	  = register;
		self.authenticate = authenticate;
		self.adminLogin   = adminLogin;

		console.log("Auth service load")

		function register(firstName,lastName,userName,email,password,passwordRedo){
			if(password == passwordRedo && password != '' && firstName != '' && lastName != '' && email != ''){
				var user = {
					firstName:firstName,
					lastName:lastName,
					username:userName,
					email:email,
					password:password
				}
				user = JSON.stringify(user);
				$http.post('/api/auth/register',user)
				.then(function(res){
					if(res.data.error){
						if(res.data.error.errors[0].message == "username must be unique"){
							toastr.error("Please have a unique Username","Error")
						} else {
							toastr.error("Please have a unique E-Mail","Error",{
								closeButton: true
							})
						}
						$state.go('register');
					} else {
						$http.post('/api/auth/authenticate',user)
						.then(function(res){	
							//introJs().start();
							swal({   
								title: "Hey!",   
								text: "Welcome to Kick App! Make sure to check out the Demo button at the top left of the screen if this is your first time",   
								type: "success",   
								confirmButtonText: "Get Started"
							});
							localStorage.loginId = res.data.id;
							localStorage.loginEmail = email;
							mapSrv.checkMsg();
							$state.go('home.map');
						},function(err){
							console.log(err)
						})
					}
				})
			} else if (firstName = ''){
				toastr.error("Please fill in your first name","Error")
			} else if (lastName = ''){
				toastr.error("Please fill in your last name","Error")
			} else if (email = ''){
				toastr.error("Please fill in your email","Error")
			} else if (password != passwordRedo){
				toastr.error("Passwords Don't Match","Error")
			} else {
				toastr.error("Please fill up the form","Error")
				authVm.signUpBtn = "Passwords Don't Match";
			}
		}

		function authenticate(email,password){
			var user = {
				email:email,
				password:password
			}
			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){	
				console.log(res.data.error)	
				localStorage.loginId = res.data.id;
				//localStorage.username = res.data;
				localStorage.loginEmail = email;
				mapSrv.checkMsg();
				$state.go('home.map')
			},function(err){
				console.log(err)
				if(err.data.err == 'wrong password'){
					toastr.error("Incorrect Password", "Error")
				} else if (err.data.err == 'wrong email'){
					toastr.error("Incorrect Email Address", "Error")
				}
			})
		}

		function adminLogin(email,password){
			var admin = {
				email:email,
				password:password
			}
			admin = JSON.stringify(admin);
			$http.post('/api/auth/authenticate',admin)
			.then(function(res){		
				localStorage.loginId = res.data.id;
				localStorage.loginEmail = email;
				$state.go('admin.dash')
			},function(err){
				console.log(err)
			})
		}

	}
})();
