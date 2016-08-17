angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, adminSrv, locations, locationType, locationName, locationId, locationCapacity, mapSrv) {

  $scope.locationName = locationName;
  $scope.locationType = locationType;
  $scope.locationId   = locationId;
  $scope.capacity = locationCapacity;
  $scope.locations = locations;
  console.log(locationCapacity)

  $scope.incrementCounter = incrementCounter;

  function incrementCounter(locationId, counter){
    console.log($scope.capacity)   
    mapSrv.updateCapacity(locationId,$scope.counter)
    return $scope.counter;
  }

  function getCounter(locationId){
    //locations.location
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


});