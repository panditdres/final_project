(function(){

	angular
		.module('mapApp')
		.service('adminSrv', adminSrv)

	function adminSrv($http, $state, api){
		var self = this;

		self.getLocations = getLocations;
		self.getUsers = getUsers;
		self.addLocation = addLocation;

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
			return api.request('/users'+userId,{},'DEL')
			.then(function(res){
				console.log(res)
			},function(err){
				console.log(err)
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

		function addLocation(location){
			// make api requests
			console.log(location);
			api.request('/location', location, 'POST')
			.then(function(res){
				console.log(res);
				if(res.status == 200){
					console.log("SUCCES POSTING VENUE")
				}
			}, function(err){
				console.log('err', err)
			})
		}

		function updateLocation(locationId, location) {
			api.request('/location/update'+locationId,location,'POST')
			.then(function(res){
				console.log(res)
				if(res.status == 200) {
					console.log("Updating locations")
				}
			})
		}

		function deleteLocation() {
			api.request('/location'+locationId,{},'DEL')
			.then(function(res){
				console.log(res)
			})
		}

		function updateList() {

		}

		function removeLocation() {

		}

	}
})();
