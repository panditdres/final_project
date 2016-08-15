(function(){

	angular
		.module('mapApp')
		.service('adminSrv', adminSrv)

	function adminSrv($http, $state, api){
		var self = this;

		self.getLocations = getLocations();

		function getLocations(){
			return api.request('/location',{},'GET')
			.then(function(res){
				console.log(res.data)
			}, function(err){
				console.log(err)
			})
		}

		function addLocation(){
			var place = {
				name: adminVm.placeName,
				lattitude: adminVm.lattitude,
				longitude: adminVm.longitude,
				type: adminVm.tpye
			}
			// make api requests
			api.request('/place', venue, 'POST')
			.then(function(res){
				console.log(res);
				if(res.status == 200){
					console.log("SUCCES POSTING VENUE")
				}
			}, function(err){
				console.log('err', err)
			})
		}

		function updateLocation() {

		}

		function deleteLocation() {

		}

		function updateList() {

		}

		function removeLocation() {

		}

	}
})();
