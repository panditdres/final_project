(function(){

	angular
		.module('mapApp')
		.service('mapSrv', mapSrv)

	function mapSrv($http, $state){
		var self = this;
		console.log("Map service loading")

		self.getUser = getUser;
		self.userCheck = userCheck;
		self.checkMsg = checkMsg;
		self.interact = interact;
		self.message;
		self.userData;
		self.logInInfo;
		self.userId;

		function getUser() {
			// check if user is even logged in
			if(localStorage.authToken){
				return $http.get('/api/users/'+localStorage.loginId)
				.success(function(data,status){
				console.log("localStorage ID",localStorage.loginId)
				console.log("DATA RETRIEVE")
				console.log(data)
			})
				.then(function(res,err){
					console.log(res.data)
					self.userData = res.data;
					self.userId = res.data.id;
					self.token = res.config.headers.authentication;
					// localStorage.setItem("token",self.token);
					// localStorage.setItem("UserId",id)
					console.log(res)
					return self.userData;
				})
			} else {
				console.log("ERROR MESSAGE")
			}
		}
		console.log("USERID", self.userId)

		function userCheck() {
			console.log("check running");
			console.log(localStorage.loginId)
			if(localStorage.loginId){
				$state.go('home.map')
			} else {
				$state.go('login')
			}

		}

		function checkMsg() {
			console.log(localStorage.authToken)
			if(localStorage.authToken) {
				self.message = "Logout";		
			} else {
				self.message = "Login";				
			}
			console.log(self.message)
			return self.message;
		}

		function interact() {
			console.log("INTERACT")
			if(localStorage.authToken) {
				console.log("IF")
				// Logout
				localStorage.clear(localStorage.authToken);
				console.log(localStorage)
				self.message = "Login";
				self.userId = ''
				$state.go('home.map');
				//$state.reload();
			} else {
				console.log("ELSE");
				// Login
				self.message = "Logout";
				$state.go('login');
				self.userId = "hello"
				//$state.reload();
			}
			return self.message;
		}


	}
})();


	  	