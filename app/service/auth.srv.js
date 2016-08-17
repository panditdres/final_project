(function(){

	angular
		.module('mapApp')
		.service('authSrv', authSrv)

	function authSrv($http, $state, api, mapSrv, toastr){
		var self = this;

		self.register = register;
		self.authenticate = authenticate;
		self.adminLogin = adminLogin;

		function register(firstName,lastName,userName,email,password,passwordRedo){
			//check passwords
			console.log('register run')
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
					console.log(res.data);
					if(res.data.error){
						// Toastr implemented
						console.log(res.data.error.errors[0].message)
						if(res.data.error.errors[0].message == "username must be unique"){
							toastr.error("Please have a unique Username","Error")
						} else {
							toastr.error("Please have a unique E-Mail","Error")
						}
						$state.go('register');
					} else {
						toastr.success("Account created","Success")
						mapSrv.checkMsg();
						$state.go('login');
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
			console.log("authenticate is running the function")
			console.log(email);
			console.log(password);
			var user = {
				email:email,
				password:password
			}
			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){
				console.log("RESPONSE",res);		
				//mapSrv.logInInfo = res.data;
				localStorage.loginId = res.data.id;
				localStorage.loginEmail = email;
				//authVm.logInBtn = res.data.msg;
				mapSrv.checkMsg();
				$state.go('home.map')
			})
		}

		function adminLogin(email,password){
			var admin = {
				email:email,
				password:password
			}
			//make api call
			admin = JSON.stringify(admin);
			$http.post('/api/auth/authenticate',admin)
			.then(function(res){
				console.log("RESPONSE",res);		
				localStorage.loginId = res.data.id;
				localStorage.loginEmail = email;
				$state.go('admin.dash')
			},function(err){
				console.log(err)
			})
		}
	}
})();
