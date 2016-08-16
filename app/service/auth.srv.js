(function(){

	angular
		.module('mapApp')
		.service('authSrv', authSrv)

	function authSrv($http, $state, api, mapSrv, toastr){
		var self = this;

		self.register = register;
		self.authenticate = authenticate;
		self.adminLogin = adminLogin;

		function register(firstName,lastName,email,password,passwordRedo){
			//check passwords
			console.log('register run')
			if(password == passwordRedo && password != ''){
				var user = {
					firstName:firstName,
					lastName:lastName,
					email:email,
					password:password
				}
				user = JSON.stringify(user);
				$http.post('/api/auth/register',user)
				.then(function(res){
					console.log(res.data);
					if(res.data.error){
						// Toastr implemented
						toastr.error("Please have a unique E-Mail","Error")
						//alert("PLEASE HAVE UNIQUE EMAIL");
						//localStorage.clear(res.data);
						$state.go('register');
					} else {
						toastr.success("Account created","Success")
						mapSrv.checkMsg();
						$state.go('home.map');
					}
				})
			}
			else{
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
