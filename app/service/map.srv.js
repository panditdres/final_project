(function(){

	angular
		.module('mapApp')
		.service('mapSrv', mapSrv)

	function mapSrv($http, $state, api, toastr){
		var self = this;
		console.log("Map service loading")

		self.getUser 			= getUser;
		self.userCheck 			= userCheck;
		self.checkMsg 			= checkMsg;
		self.interact 			= interact;
		self.updateUser 		= updateUser;
		self.settings 			= settings;
		self.defaultView 		= defaultView;

		self.addPlayer      	= addPlayer;
		self.friendRequest		= friendRequest;
		self.addFriend      	= addFriend;
		self.getFriend			= getFriend;
		self.getLocation    	= getLocation;
		self.sendInvite     	= sendInvite;
		self.addPlayingLocation = addPlayingLocation;
		self.allInvites			= allInvites;
		self.getInvite 			= getInvite;
		self.getUserInvite		= getUserInvite;
		self.getLocationInvite	= getLocationInvite;
		self.getLocationNameAccept  = getLocationNameAccept;
		self.getUserNameAccept      = getUserNameAccept;

		self.updateInvitation   = updateInvitation;
		self.upload				= upload;
		self.updateProfilePic   = updateProfilePic;

		self.addReview			= addReview;

		self.notifyGetUser		= notifyGetUser;
		self.notifyGetLocation  = notifyGetLocation;

		self.message;
		self.userData;
		self.logInInfo;
		self.userId;

		function upload(fileName,userId){
			var file = fileName;
			var user = userId;
		    var formData = new FormData();
		    formData.append('file', file);

		    $http.post('/api/upload',formData, {
		        transformRequest: angular.identity,
		        headers: {'Content-Type': undefined}
		    })
		    .then(function(res){
		    	console.log(res.data)
		    	self.filePath = res.data.path.slice(6);
		    	toastr.success('Profile Picture Updated', 'Success')
		    	console.log(self.filePath)
		      	console.log('successfully uploaded file!');
		      	self.updateProfilePic(self.filePath,userId)
		    })
		    .catch(function(err){
		      	console.log(err);
		    });
		}

		function defaultView(){
			self.showDefault = true;
			self.showSettings = false;
		}

		function settings(){
			self.showSettings = true;
			self.showDefault = false;
		}

		function getUser() {
			// check if user is even logged in
			if(localStorage.authToken){
				return $http.get('/api/users/'+localStorage.loginId)
				.success(function(data,status){
			})
				.then(function(res,err){
					//console.log(res.data)
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

		function updateProfilePic(filePath, userId){
			console.log(filePath)
			console.log(userId)
			var fileObj = {
				path: filePath
			}
			return api.request('/users/profilePic/'+userId,fileObj,'PUT')
			.then(function(res){
				console.log(res);
				$state.reload()
				self.defaultView();
				return res;
			})
		}

		function updateInvitation(inviteId,invitations){
			console.log("UPDATE INVITATIONS",invitations)
			return api.request('/invites/'+inviteId,invitations,'PUT')
			.then(function(res){
				console.log(res)
				return res;
			})
		}

		function updateUser(user, userId){
			return api.request('/users/update/'+userId,user,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.defaultView();
				}
			})
		}

		function allInvites(){
			return api.request('/invites/',{},'GET')
			.then(function(res){
				//console.log("Get invites",res.data)
				self.invites = res.data;
				return self.invites;
			})
		}

		function getInvite(inviteId){
			return api.request('/invites/'+inviteId,{},'GET')
			.then(function(res){
				console.log("Get SINGLE INVITE",res.data)
				self.invite = res.data;
				return self.invite;
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

		function addPlayer(locationId,players){
			console.log("ADD player to location")
			return api.request('/location/player/'+locationId,players,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.defaultView();
				}
			})
		}

		function addPlayingLocation(userId,userPlaying){
			console.log("ADD location to user")
			return api.request('/users/location/'+userId,userPlaying,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.defaultView();
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

		function friendRequest(userId, requestArray){
			return api.request('/users/friendRequest/'+userId,requestArray,'PUT')
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
			self.locationDataArr = []
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				self.locationDataArr.push(res.data);
				return self.locationDataArr;
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

		function addReview(locationId,userId,body){
			return api.request('/reviews/',body,'POST')
			.then(function(res){
				console.log(res)
			})
		}

		function notifyGetUser(acceptedArr,userId){
			console.log(userId)
			return api.request('/users/'+userId,{},'GET')
			.then(function(res){
				console.log(res)
				console.log(acceptedArr)
				var notifyObj = {
					res:res,
					array:acceptedArr
				}
				return notifyObj;
			})

		}

		function notifyGetLocation(acceptedArr,user,locationId){
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				console.log(res)
				console.log(acceptedArr)
				var notifyObj = {
					res:res,
					array:acceptedArr,
					user:user
				}
				return notifyObj;
			})
		}

	}
})();


	  	