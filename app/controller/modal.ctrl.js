angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, adminSrv, locations, locationType, locationName, locationId, locationCapacity, maxCapacity, mapSrv, toastr) {

  modalVm = this;

  modalVm.locationName = locationName;
  modalVm.locationType = locationType;
  modalVm.locationId   = locationId;
  modalVm.capacity = locationCapacity;
  modalVm.maxCapacity = maxCapacity;
  modalVm.locations = locations;
  console.log(maxCapacity)

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel = cancel;

  modalVm.goBtn = false;
  modalVm.cancelBtn = true;

  function incrementCounter(locationId, counter){ 
    if(modalVm.capacity > modalVm.maxCapacity - 1){
      toastr.error('There are no more spots', 'Error')
    } else {
      modalVm.capacity++;
      modalVm.goBtn = true;
      modalVm.cancelBtn = false;
      mapSrv.updateCapacity(locationId,modalVm.capacity)
    }
  }

  function cancel(locationId, counter) {
    modalVm.capacity--;
    modalVm.cancelBtn = true;
    modalVm.goBtn = false;
    mapSrv.updateCapacity(locationId,modalVm.capacity)
  };

});