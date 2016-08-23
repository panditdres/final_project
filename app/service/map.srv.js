(function(){

	angular
		.module('mapApp')
		.service('mapSrv', mapSrv)

	function mapSrv($http, $state, api){
		var self = this;
		console.log("Map service loading")

		self.getUser 			= getUser;
		self.userCheck 			= userCheck;
		self.checkMsg 			= checkMsg;
		self.interact 			= interact;
		self.updateUser 		= updateUser;
		self.profile 			= profile;
		self.settings 			= settings;
		self.defaultView 		= defaultView;
		self.getCapacity 		= getCapacity;
		self.updateCapacity 	= updateCapacity;
		self.addPlayer      	= addPlayer;
		self.addFriend      	= addFriend;
		self.getFriend			= getFriend;
		self.getLocation    	= getLocation;
		self.sendInvite     	= sendInvite;
		self.addPlayingLocation = addPlayingLocation;
		self.allInvites			= allInvites;
		self.getUserInvite		= getUserInvite;
		self.getLocationInvite	= getLocationInvite;
		self.getLocationNameAccept  = getLocationNameAccept;
		self.getUserNameAccept      = getUserNameAccept;
		// self.accept 			= accept;
		// self.reject 			= reject;
		self.updateInvitation   = updateInvitation;

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
			})
				.then(function(res,err){
					console.log(res.data)
					self.userData = res.data;
					self.userId = res.data.id;
					self.token = res.config.headers.authentication;
					return self.userData;
				})
			} else {
				console.log("ERROR MESSAGE")
			}
		}

		function getUserInvite(userId,index,date,inviteId){
			return api.request('/users/'+userId,{},'GET')
			.then(function(res){
				self.userInviteData = {
					data: res.data,
					index: index,
					date:date,
					inviteId:inviteId
				}
				console.log(res.data)
				return self.userInviteData
			})
		}

		function getLocationInvite(firstName,lastName,locationId,date,inviteId){
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				//console.log("INVTIE LOCATION",res)
				self.locationInviteData = {
					location: res.data.location,
					firstName: firstName,
					lastName: lastName,
					date: date,
					inviteId: inviteId
				}
				return self.locationInviteData
			})
		}

		function updateInvitation(inviteId,invitations){
			console.log("UPDATE INVITATIONS",invitations)
			return api.request('/invites/'+inviteId,invitations,'PUT')
			.then(function(res){
				console.log(res)
			})
		}

		function updateUser(user, userId){
			return api.request('/users/update/'+userId,user,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.profile();
				}
			})
		}

		function allInvites(){
			return api.request('/invites/',{},'GET')
			.then(function(res){
				console.log("Get invites",res.data)
				self.invites = res.data;
				return self.invites;
			})
		}

		function getLocationNameAccept(locationId,hostId,event){
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				self.locationData = {
					data:res.data,
					hostId: hostId,
					event: event
				}
				return self.locationData;
			})
		}

		function getUserNameAccept(data,userId,event){
			return api.request('/users/'+userId,{},'GET')
			.then(function(res){
				self.userData = {
					data:data,
					user:res.data,
					event:event
				}
				return self.userData;
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

		function addPlayingLocation(userId,userPlaying){
			console.log("ADD location to user")
			return api.request('/users/location/'+userId,userPlaying,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.profile();
				}
			})
		}

		function addFriend(userId, friendArray){
			console.log("Add friend service")
			return api.request('/users/friends/'+userId,friendArray,'PUT')
			.then(function(res){
				console.log(res)
			})
		}

		function getFriend(friendId){
			self.friendData = [];
			return api.request('/users/'+friendId,{},'GET')
			.then(function(res){
				self.friendData.push(res.data);
				return self.friendData;
			})
		}

		function getLocation(locationId){
			self.locationData = []
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				self.locationData.push(res.data);
				return self.locationData;
			})
		}

		function sendInvite(locationId,userId,invitation){
			return api.request('/location/invite/'+locationId,invitation,'POST')
			.then(function(res){
				console.log(res)
			})	
		}

		function userCheck() {
			if(localStorage.loginId){
				$state.go('home.map')
			} else {
				$state.go('login')
			}
		}

		function checkMsg() {
			if(localStorage.authToken) {
				self.message = "Logout";		
			} else {
				self.message = "Login";				
			}
			return self.message;
		}

		function interact() {
			console.log("INTERACT")
			if(localStorage.authToken) {
				// Logout
				localStorage.clear(localStorage.authToken);
				localStorage.clear(localStorage.loginId);
				console.log(localStorage)
				self.message = "Login";
				self.userId = ''
				$state.go('home.map');
			} else {
				// Login
				self.message = "Logout";
				$state.go('login');
				self.userId = "hello"
			}
			return self.message;
		}
	}
})();


	  	