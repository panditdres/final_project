(function(){

	angular
		.module('mapApp')
		.service('mapSrv', mapSrv)

	function mapSrv($http, $state, api){
		var self = this;
		console.log("Map service loading")

		self.getUser 		= getUser;
		self.userCheck 		= userCheck;
		self.checkMsg 		= checkMsg;
		self.interact 		= interact;
		self.updateUser 	= updateUser;
		self.profile 		= profile;
		self.settings 		= settings;
		self.defaultView 	= defaultView;
		self.getCapacity 	= getCapacity;
		self.updateCapacity = updateCapacity;
		self.addPlayer      = addPlayer;

		self.message;
		self.userData;
		self.logInInfo;
		self.userId;

		function defaultView(){
			self.showDefault = true;
			self.showProfile = false;
			self.showSettings = false;
		}

		function profile(){
			console.log("profile")
			self.showProfile = true;
			self.showDefault = false;
			self.showSettings = false;
		}
		console.log("SHOW PRO", self.showProfile)

		function settings(){
			self.showSettings = true;
			self.showDefault = false;
			self.showProfile = false;
		}

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

		function updateUser(user, userId){
			return api.request('/users/update/'+userId,user,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.profile();
				}
			})
		}

		function getCapacity() {
			return api.request('/location/capacity',{},'GET')
			.then(function(res){
				console.log("GET CAPACITY",res.data)
			})
		}

		function updateCapacity(locationId, capacity){
			console.log("UPDATE SRV",locationId)
			return api.request('/location/capacity/'+locationId,{capacity},'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.profile();
				}
			})
		}

		function addPlayer(locationId,players){
			console.log("ADD player to location")
			return api.request('/location/player/'+locationId,players,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.profile();
				}
			})
		}

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


	  	