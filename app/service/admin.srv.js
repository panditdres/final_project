(function(){

	angular
		.module('mapApp')
		.service('adminSrv', adminSrv)

	function adminSrv($http, $state, api, toastr){
		var self = this;

		self.getLocations 	= getLocations;
		self.getUsers 		= getUsers;
		self.deleteUser 	= deleteUser;
		self.updateUser 	= updateUser;

		self.addLocation 	= addLocation;
		self.deleteLocation = deleteLocation;
		self.removeLocation = removeLocation;
		self.updateLocation = updateLocation;
		self.updateLocationList = updateLocationList;
		
		self.getLocation = getLocation;

		self.locations = [];
		self.users 	   = [];
		self.currCapacity = 0;
		self.location;

		console.log("LOCATIONS ARRAY",self.locations)

		function getUsers(){
			return api.request('/users',{},'GET')
			.then(function(res){
				//success callback
				console.log(res.data);
				self.users = res.data.users;
				console.log(self.users)
				return self.users;
			},function(err){
				//error callback
				console.log(err);
				return;
			})
		}

		function deleteUser(userId){
			console.log("DELETE USER")
			console.log(userId)
			return api.request('/users/'+userId,{},'DEL')
			.then(function(res){
				console.log(res)
				$state.go('admin.allUsers')
				$state.reload()
			},function(err){
				console.log(err)
			})
		}
		
		function updateUser(user, userId){
			return api.request('/users/update/'+userId,user,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					console.log("update users");
					$state.go('admin.allUsers')
					$state.reload();
				}
			})
		}

		function getLocations(){
			return api.request('/location',{},'GET')
			.then(function(res){
				console.log("GET LOCATION",res.data)
				self.locations = res.data.locations;
				console.log(self.locations)
				return self.locations;
			}, function(err){
				console.log(err)
			})
		}

		function getLocation(locationId){
			return api.request('/location/'+locationId,{},'GET')
			.then(function(res){
				console.log(res.data)
				self.location = res.data;
				return self.location;
			})
		}

		function addLocation(location){
			console.log(location);
			api.request('/location', location, 'POST')
			.then(function(res){
				console.log(res);
				if(res.status == 200){
					self.locations.push(res.data.location)
					$state.go('admin.allLocation')
				}
			}, function(err){
				console.log('err', err)
			})
		}

		function updateLocation(location, locationId) {
			api.request('/location/update/'+locationId,location,'PUT')
			.then(function(res){
				console.log(res)
				if(res.status == 200) {
					console.log("Updating locations")
					self.updateLocationList(location,locationId);
					$state.go('admin.allLocation');
					$state.reload();
				}
			})
		}

		function updateLocationList(location,locationId){
			for(var j = 0; j < self.location.length; j++){
				if(self.location[j].id == locationId){
					self.location[j].name = location.name;
					self.location[j].latitude = location.latitude;
					self.location[j].longitude = location.longitude;
					self.location[j].type = location.type;
					self.location[j].maxCapacity = location.maxCapacity;
				}
			}
		}

		function deleteLocation(locationId) {
			console.log("delete locationId",locationId)
			api.request('/location/'+locationId,{},'DEL')
			.then(function(res){
				console.log(res)
				if(res.status === 200){
					self.removeLocation(locationId);
					$state.go('admin.allLocation')					
					$state.reload();					
				}
			})
		}

		function removeLocation(locationId){
			for(var i = 0; i < self.locations.length; i++){
				if(self.locations[i].id == locationId){
					delete self.locations[i];
				}
			}
		}
	}
})();
