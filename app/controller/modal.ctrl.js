angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, users, locations, friends, reviews, locationType, locationName, locationId, locationCapacity, maxCapacity, mapSrv, locationAddress, locationPlayers, toastr) {

  modalVm = this;
  console.log(friends)
  modalVm.friendData      = friends;
  modalVm.locationAddress = locationAddress;
  modalVm.locationName    = locationName;
  modalVm.locationType    = locationType;
  modalVm.locationId      = locationId;
  modalVm.capacity        = locationCapacity;
  modalVm.maxCapacity     = maxCapacity;

  console.log(modalVm.locationId)
  //modalVm.sendInvite      = sendInvite;
  modalVm.addPlayer             = addPlayer;
  modalVm.removePlayer          = removePlayer;
  modalVm.addPlayingLocation    = addPlayingLocation;
  modalVm.removePlayingLocation = removePlayingLocation;
  modalVm.locationPlayers       = locationPlayers;
  modalVm.checkPlayer           = checkPlayer;
  modalVm.showInvite            = showInvite;
  modalVm.invite                = invite;
  modalVm.addInvite             = addInvite;
  modalVm.subInvite             = subInvite;
  modalVm.sendInvite            = sendInvite;

  // review navigation
  modalVm.showReviews           = showReviews;
  modalVm.writeReview           = writeReview;

  // review functions to api
  modalVm.allReviews            = reviews
  modalVm.addReview             = addReview;
  modalVm.getReview             = getReview;
  console.log(reviews)

  modalVm.checkPlayer();

  modalVm.locations = locations;
  modalVm.users     = users;
  modalVm.user      = user;

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel           = cancel;

  modalVm.invitation = [];
  modalVm.userPlaying = user.playing;

  modalVm.inviteInfo = false;
  modalVm.reviewInfo = false;
  modalVm.writeReviewInfo = false;
  modalVm.locationInfo = true;

  modalVm.inviteBtn = false;

  modalVm.mytime      = new Date();
  modalVm.hstep       = 1;
  modalVm.mstep       = 15;
  modalVm.ismeridian  = true;

  modalVm.reviewMessage = true;

  function showInvite(){
    modalVm.inviteInfo = true;
    modalVm.locationInfo = false;
    modalVm.reviewInfo = false;
    modalVm.writeReviewInfo = false
  }

  function showReviews(){
    modalVm.inviteInfo = false;
    modalVm.locationInfo = false;
    modalVm.reviewInfo = true;
    modalVm.writeReviewInfo = false
  }

  function writeReview(){
    console.log("TEST")
    modalVm.inviteInfo = false;
    modalVm.locationInfo = false;
    modalVm.reviewInfo = false;
    modalVm.writeReviewInfo = true;
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
    for(var i = 0; i < modalVm.invitation.length; i++){
      if(modalVm.invitation[i] == friendId){
        modalVm.invitation.splice(i,1);
      }
    }
    console.log(modalVm.invitation)
  }

  function sendInvite(locationId, user){
    console.log(modalVm.invitation)
    console.log(locationId)
    //console.log(userId)
    console.log(modalVm.eventDate)
    var invite = {
      "userId": user.id,
      "locationId": locationId,
      "date": modalVm.eventDate,
      "invited": modalVm.invitation
    }
    $uibModalInstance.close()
    mapSrv.sendInvite(locationId,user.id,invite)
  }

  function addPlayer(locationId,playerInfo){
      console.log(modalVm.mytime)
    // console.log(locationId);
    if(modalVm.locationPlayers.length > modalVm.maxCapacity - 1) {
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

  function addPlayingLocation(userId,locationId){
    console.log("addplaying location")
    if(modalVm.userPlaying == null){
      modalVm.userPlaying = [];
      modalVm.userPlaying.push(locationId);
      mapSrv.addPlayingLocation(userId,modalVm.userPlaying)
    } else {
      modalVm.userPlaying.push(locationId);
      mapSrv.addPlayingLocation(userId,modalVm.userPlaying)
    }
  }

  function removePlayingLocation(userId,locationId){
    console.log(locationId)
    console.log(modalVm.userPlaying)
    console.log(modalVm.userPlaying[4])
    for(var i = 0; i < modalVm.userPlaying.length; i++){
      if(modalVm.userPlaying.includes(locationId)){
        modalVm.userPlaying.splice(i, 1);
        mapSrv.addPlayingLocation(userId,modalVm.userPlaying);
      }
    }
  }

  function incrementCounter(locationId, counter){ 
    if(modalVm.locationPlayers.length > modalVm.maxCapacity - 1){
      toastr.error('There are no more spots', 'Error')
    } else {
      modalVm.goBtn = true;
      modalVm.cancelBtn = false;
    }
  }

  function cancel(locationId, counter) {
    modalVm.cancelBtn = true;
    modalVm.goBtn = false;
  };

  function addReview(locationId, userId){
    console.log(userId)
    var reviewObj = {
      "title": modalVm.reviewTitle,
      "body": modalVm.reviewBody,
      "locationId": locationId,
      "userId": userId
    }
    toastr.success('Your review has been sent','Success')
    $uibModalInstance.close()
    mapSrv.addReview(locationId,userId,reviewObj);
  }

  function getReview(locationId){
    console.log(locationId)
    modalVm.locationNameReview = [];
    for(var i = 0; i < modalVm.allReviews.length; i++){
      if(modalVm.allReviews[i].locationId == locationId){
        console.log(modalVm.allReviews[i])
        var reviews = modalVm.allReviews[i]     
        mapSrv.getUserReview(modalVm.allReviews[i].userId,reviews)
        .then(function(res){
          console.log(res)
          modalVm.locationNameReview.push(res);
          if(modalVm.locationNameReview.length != 0){
            modalVm.reviewMessage = false;
          }
          // console.log(modalVm.locationNameReview)
        })
      }
    }
  }
  modalVm.getReview(modalVm.locationId)

});