angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, users, locations, friends, locationType, locationName, locationId, locationCapacity, maxCapacity, mapSrv, locationAddress, locationPlayers, toastr) {

  modalVm = this;
  console.log(friends)
  modalVm.friendData      = friends;
  modalVm.locationAddress = locationAddress;
  modalVm.locationName    = locationName;
  modalVm.locationType    = locationType;
  modalVm.locationId      = locationId;
  modalVm.capacity        = locationCapacity;
  modalVm.maxCapacity     = maxCapacity;

  //modalVm.sendInvite      = sendInvite;
  modalVm.addPlayer       = addPlayer;
  modalVm.removePlayer    = removePlayer;
  modalVm.locationPlayers = locationPlayers;
  modalVm.checkPlayer     = checkPlayer;
  modalVm.showInvite      = showInvite;
  modalVm.invite   = invite;
  modalVm.addInvite = addInvite;
  modalVm.subInvite = subInvite

  modalVm.checkPlayer();

  modalVm.locations = locations;
  modalVm.users     = users;
  modalVm.user      = user;

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel           = cancel;

  modalVm.invitation = [];

  modalVm.inviteInfo = false;
  modalVm.locationInfo = true;

  modalVm.inviteBtn = false;

  function showInvite(){
    modalVm.inviteInfo = true;
    modalVm.locationInfo = false;
  }

  function checkPlayer(){
    if(modalVm.locationPlayers.includes(user.firstName + ' ' + user.lastName + ' - ' + user.username) == true) {
      modalVm.goBtn = true;
      modalVm.cancelBtn = false;
    } else {
      modalVm.goBtn = false;
      modalVm.cancelBtn = true;
    }
  }

  function invite(friendId){
    console.log("invite")
    if(modalVm.invitation.indexOf(friendId) == -1){
      modalVm.addInvite(friendId)
    }else{
      modalVm.subInvite(friendId)
    }
  }

  function addInvite(friendId){
    console.log("add invite")
    modalVm.inviteBtn = true;
    modalVm.invitation.push(friendId)
    console.log(modalVm.invitation)
  }

  function subInvite(friendId){
    console.log("remove invite")
    for(var i = 0; modalVm.invitation.length; i++){
      if(modalVm.invitation[i]==friendId){
        modalVm.invitation.splice(i,1);
      }
    }
    console.log(modalVm.invitation)
  }

  // function sendInvite(locationId, userId){
  //   modalVm.invitation.push()
  //   mapSrv.sendInvite(locationId,userId,modalVm.invitation)
  // }

  function addPlayer(locationId,playerInfo){
    // console.log(playerInfo);
    // console.log(locationId);
    if(modalVm.locationPlayers.length > 30) {
      toastr.error('There are no more spots', 'Error')
    }else{
      modalVm.locationPlayers.push(playerInfo.firstName + ' ' + playerInfo.lastName + ' - ' + playerInfo.username);
      mapSrv.addPlayer(locationId,modalVm.locationPlayers);
    }
  }

  function removePlayer(locationId,playerInfo){
    // console.log(modalVm.locationPlayers)
    // console.log(locationId)
    // console.log(playerInfo)
    for(var i = 0; i < modalVm.locationPlayers.length; i++){
      if(modalVm.locationPlayers[i].includes(modalVm.user.username)){
        modalVm.locationPlayers.splice(i,1)
        mapSrv.addPlayer(locationId,modalVm.locationPlayers)
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