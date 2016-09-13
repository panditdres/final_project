angular.module('mapApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, users, locations, friends, reviews, locationType, locationName, locationId, locationCapacity, maxCapacity, mapSrv, adminSrv, locationAddress, locationPlayers, toastr) {

  modalVm = this;

  modalVm.friendData      = friends;
  modalVm.locationAddress = locationAddress;
  modalVm.locationName    = locationName;
  modalVm.locationType    = locationType;
  modalVm.locationId      = locationId;
  modalVm.capacity        = locationCapacity;
  modalVm.maxCapacity     = maxCapacity;

  modalVm.addPlayer             = addPlayer;
  modalVm.removePlayer          = removePlayer;
  modalVm.addPlayingLocation    = addPlayingLocation;
  modalVm.removePlayingLocation = removePlayingLocation;
  modalVm.locationPlayersForDB  = locationPlayers;
  modalVm.checkPlayer           = checkPlayer;
  modalVm.showInvite            = showInvite;
  modalVm.invite                = invite;
  modalVm.addInvite             = addInvite;
  modalVm.subInvite             = subInvite;
  modalVm.sendInvite            = sendInvite;
  modalVm.close                 = close;

  modalVm.locationPlayers       = locationPlayers;
  
  // review navigation
  modalVm.showReviews           = showReviews;
  modalVm.writeReview           = writeReview;

  // review functions to api
  modalVm.allReviews            = reviews
  modalVm.addReview             = addReview;
  modalVm.getReview             = getReview;

  modalVm.locations = locations;
  modalVm.users     = users;
  modalVm.user      = user;

  modalVm.incrementCounter = incrementCounter;
  modalVm.cancel           = cancel;

  modalVm.showTime = showTime
  modalVm.hideTime = hideTime;

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

  modalVm.timepicker = true

  modalVm.checkPlayer();

  // console.log(locationPlayers)
  for(var i = 0; i < modalVm.locationPlayers.length; i++){
    if(typeof modalVm.locationPlayers[i] == "string"){
      console.log("type string")
      console.log(locationPlayers)
      modalVm.locationPlayers[i] = JSON.parse(locationPlayers[i])
    } else {
      console.log("type object")
    }
  }


  function hideTime(){
    modalVm.timepicker = false;
  }

  function showTime(){
    modalVm.timepicker = true;
  }

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
    modalVm.inviteInfo = false;
    modalVm.locationInfo = false;
    modalVm.reviewInfo = false;
    modalVm.writeReviewInfo = true;
  }

  function checkPlayer(){
    modalVm.goBtn = false;
    modalVm.cancelBtn = true;
    if(modalVm.locationPlayers == undefined){
      modalVm.locationPlayers = [];
    }
    for(var i = 0; i < modalVm.locationPlayers.length; i++){
      console.log(modalVm.locationPlayers[i].username == modalVm.user.username)
      console.log(modalVm.locationPlayers[i])
      console.log(modalVm.user.username)
      if(typeof modalVm.locationPlayers[i] == "string"){
        modalVm.locationPlayers[i] = JSON.parse(modalVm.locationPlayers[i])
      }
      if(modalVm.locationPlayers[i].username == modalVm.user.username){
        console.log("cancel Btn enabled")
        modalVm.goBtn = true;
        modalVm.cancelBtn = false;
        modalVm.timepicker = false;
      } else {
        console.log("Go Btn enabled")
        modalVm.goBtn = false;
        modalVm.cancelBtn = true;
      }
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
    modalVm.inviteBtn = true;
    modalVm.invitation.push(friendId)
  }

  function subInvite(friendId){
    for(var i = 0; i < modalVm.invitation.length; i++){
      if(modalVm.invitation[i] == friendId){
        modalVm.invitation.splice(i,1);
      }
    }
  }

  function sendInvite(locationId, user){
    var today = new Date()
    if(!modalVm.eventDate){ 
      toastr.info("Please input a date","Info")
    } else if (Date.parse(modalVm.eventDate) < today.valueOf()){
      toastr.info("Please select appropriate date","Info")
    } else {
      var invite = {
        "userId": user.id,
        "locationId": locationId,
        "date": modalVm.eventDate,
        "invited": modalVm.invitation
      }
      $uibModalInstance.close()
      mapSrv.sendInvite(locationId,user.id,invite)
    }
  }

  function close(){
    $uibModalInstance.close()
  }

  function addPlayer(locationId,playerInfo){
    if(modalVm.locationPlayers.length > modalVm.maxCapacity - 1) {
      toastr.error('There are no more spots', 'Error')
    }else{
      var info = {
        firstName: playerInfo.firstName,
        lastName: playerInfo.lastName,
        username: playerInfo.username,
        time: modalVm.mytime
      }
      modalVm.locationPlayersForDB.push(JSON.stringify(info));
      for(var i = 0; i < modalVm.locationPlayersForDB.length; i++){
        if(typeof modalVm.locationPlayersForDB[i] == "object"){
          modalVm.locationPlayersForDB[i] = JSON.stringify(modalVm.locationPlayersForDB[i])
        }
      }
      mapSrv.addPlayer(locationId,modalVm.locationPlayersForDB)
      .then(function(res){
        for(var i = 0; i < res.data.location.length; i++){
          if(typeof res.data.location[i] == "object"){
            res.data.location[i] = JSON.stringify(res.data.location[i])
          }
          modalVm.locationPlayers[i] = JSON.parse(res.data.location[i])
        }
      });
    }
  }

  function removePlayer(locationId,playerInfo){
    for(var i = 0; i < modalVm.locationPlayers.length; i++){
      if(modalVm.locationPlayers[i].username == modalVm.user.username){
        modalVm.locationPlayers.splice(i,1)
        mapSrv.removePlayer(locationId,modalVm.locationPlayersForDB)
        .then(function(res){
          console.log(res.data.location)
          for(var i = 0; i < res.data.location.length; i++){
          if(typeof res.data.location[i] == "object"){
            res.data.location[i] = JSON.stringify(res.data.location[i])
          }
          modalVm.locationPlayers[i] = JSON.parse(res.data.location[i])
        }
        })        
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
    modalVm.hideTime();
  }

  // might be fixed?
  function removePlayingLocation(userId,locationId){
    for(var i = 0; i < modalVm.userPlaying.length; i++){
      if(modalVm.userPlaying[i] == locationId){
        modalVm.userPlaying.splice(i, 1);
        mapSrv.addPlayingLocation(userId,modalVm.userPlaying);
      }
    }
    modalVm.showTime();
  }

  function incrementCounter(locationId){ 
    if(modalVm.locationPlayers.length > modalVm.maxCapacity - 1){
      toastr.error('There are no more spots', 'Error')
    } else {
      modalVm.goBtn = true;
      modalVm.cancelBtn = false;
    }
  }

  function cancel(locationId) {
    modalVm.cancelBtn = true;
    modalVm.goBtn = false;
  };

  function getReview(locationId){
    adminSrv.getReviews()
    .then(function(res){
      modalVm.allReviews = res;
      modalVm.locationNameReview = [];
      for(var i = 0; i < modalVm.allReviews.length; i++){
        if(modalVm.allReviews[i].locationId == locationId){
          var reviews = modalVm.allReviews[i]     
          mapSrv.getUserReview(modalVm.allReviews[i].userId,reviews)
          .then(function(res){
            modalVm.locationNameReview.push(res);
            if(modalVm.locationNameReview.length != 0){
              modalVm.reviewMessage = false;
            }
          })
        }
      }
    });
  }
  modalVm.getReview(modalVm.locationId)

  function addReview(locationId, userId){
    var reviewObj = {
      "title": modalVm.reviewTitle,
      "body": modalVm.reviewBody,
      "locationId": locationId,
      "userId": userId
    }
    toastr.success('Your review has been sent','Success')
    $uibModalInstance.close()
    mapSrv.addReview(locationId,userId,reviewObj)
    .then(function(res){
      modalVm.getReview(locationId);
    });
  }

});