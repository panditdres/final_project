angular.module('mapApp')
  .controller('ModalInstanceFriendCtrl', function ($scope, $uibModalInstance, user, users, locations, friends, friendInfo, adminSrv, mapSrv, toastr) {

  modalVm = this;

  console.log("modal friend")
  console.log(user)
  console.log(friendInfo)

  modalVm.friendData  = friends;
  modalVm.locations   = locations;
  modalVm.users       = users;
  modalVm.user        = user;
  modalVm.friendInfo  = friendInfo;
  modalVm.close       = close;
  
  function close(){
    $uibModalInstance.close()
  }

});