angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, users, locations, locationType, locationName, locationId, locationCapacity, maxCapacity, mapSrv, locationAddress, locationPlayers, toastr) {

  modalVm = this;

  modalVm.locationAddress = locationAddress;
  modalVm.locationName = locationName;
  modalVm.locationType = locationType;
  modalVm.locationId   = locationId;
  modalVm.capacity = locationCapacity;
  modalVm.maxCapacity = maxCapacity;

  modalVm.addPlayer = addPlayer;
  modalVm.locationPlayers = locationPlayers;
  console.log(locationPlayers)

  modalVm.locations = locations;
  modalVm.users = users;
  modalVm.user = user;
  console.log(modalVm.user);

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel = cancel;

  modalVm.goBtn = false;
  modalVm.cancelBtn = true;

  function addPlayer(locationId,playerInfo){
    console.log(playerInfo);
    console.log(locationId);
    if(modalVm.locationPlayers.length > 30) {
      toastr.error('There are no more spots', 'Error')
    }else{
      modalVm.locationPlayers.push(playerInfo.firstName + ' ' + playerInfo.lastName);
      mapSrv.addPlayer(locationId,modalVm.locationPlayers);
    }
  }

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