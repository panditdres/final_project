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
		self.getReviews  = getReviews;

		self.deleteReview = deleteReview;
		self.removeReview = removeReview;

		self.locations = [];
		self.users 	   = [];
		self.reviews   = [];
		self.currCapacity = 0;
		self.location;
		self.user;

		function getReviews(){
			return api.request('/reviews/',{},'GET')
			.then(function(res){
				self.reviews = res.data.reviews
				return res.data.reviews;
			})
		}

		function getUsers(){
			return api.request('/users',{},'GET')
			.then(function(res){
				self.users = res.data.users;
				return self.users;
			},function(err){
				console.log(err);
				return;
			})
		}

		function getUser(userId){
			return api.request('/users/'+locationId,{},'GET')
			.then(function(res){
				console.log(res.data)
				self.user = res.data;
				return self.user;
			})
		}

		function deleteUser(userId){
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
				//console.log("GET LOCATION",res.data)
				self.locations = res.data.locations;
				//console.log(self.locations)
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
					$state.go('admin.allLocation');
					self.getLocations();
					// $state.reload();
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

		function deleteReview(reviewId){
			console.log("service delete")
			return api.request('/reviews/'+reviewId,{},'DEL')
			.then(function(res){
				console.log(res)
				self.removeReview(reviewId)
				$state.go('admin.allReview')
				$state.reload()
			})
		}

		function removeReview(reviewId){
			for(var i = 0; i < self.reviews.length; i++){
				if(self.reviews[i].id == reviewId){
					delete self.reviews[i];
				}
			}
		}
	}
})();
