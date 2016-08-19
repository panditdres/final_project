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
  modalVm.removePlayer = removePlayer;
  modalVm.locationPlayers = locationPlayers;
  modalVm.checkPlayer = checkPlayer;
  modalVm.checkPlayer();
  console.log(modalVm.locationPlayers)

  modalVm.locations = locations;
  modalVm.users = users;
  modalVm.user = user;
  console.log(modalVm.user);

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel = cancel;



  function checkPlayer(){
    // console.log("check player running") 
    // console.log("username no JSON", user.firstName + ' ' + user.lastName + ' - ' + user.username)
    // console.log("username", JSON.stringify(user.firstName + ' ' + user.lastName + ' - ' + user.username))
    // console.log("CHECK",modalVm.locationPlayers.includes(user.firstName + ' ' + user.lastName + ' - ' + user.username))

    if(modalVm.locationPlayers.includes(user.firstName + ' ' + user.lastName + ' - ' + user.username) == true) {
      console.log("HELLO THIS RUNS")
      modalVm.goBtn = true;
      modalVm.cancelBtn = false;
    } else {
      modalVm.goBtn = false;
      modalVm.cancelBtn = true;
    }

  }

  function addPlayer(locationId,playerInfo){
    console.log(playerInfo);
    console.log(locationId);
    if(modalVm.locationPlayers.length > 30) {
      toastr.error('There are no more spots', 'Error')
    }else{
      modalVm.locationPlayers.push(playerInfo.firstName + ' ' + playerInfo.lastName + ' - ' + playerInfo.username);
      mapSrv.addPlayer(locationId,modalVm.locationPlayers);
    }
  }

  function removePlayer(locationId,playerInfo){
    console.log(modalVm.locationPlayers)
    console.log(locationId)
    console.log(playerInfo)
    for(var i = 0; i < modalVm.locationPlayers.length; i++){
      if(modalVm.locationPlayers[i].includes(modalVm.user.username)){
        modalVm.locationPlayers.splice(i,1)
      }
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