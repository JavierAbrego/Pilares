var Friend = require('../../models/friend');
var User = require('../../models/user');

function FriendService() {
}

function lookupFriend(id) {
  return { id: id };
}

function addFriends(userId, friends, successHandler, errorHandler){
  var onEventSaved = function(err){
    if(err) return errorHandler();
    successHandler();

  };
  Friend.count({'userId' : userId},function(err, count){
    if(err) return errorHandler();
    if(count>0){
      //TODO: update
      successHandler();
    }else{
      //add
      var item =  new Friend();
      item.userId = userId;
      item.friendUserId = friends;
      item.save(onEventSaved);
    }
  });
}

function getFriends(userId, successHandler, errorHandler){
  var pendingRequests = 0;
  var response = [];

  var makeUserCheckedCallback = function(friendId){
    return function(err, count){
      if(err) errorHandler();
      if(count>0){
        response.push(friendId);
      }
      pendingRequests--;
      if(pendingRequests==0){
        successHandler(response);
      }
    };
  };

  var onFriendsRetrieved = function(err, friend){
    if(err) return errorHandler();
    if(friend.length==0){
      return successHandler(response);
    }
    pendingRequests = friend[0].friendUserId.length;
    for(var i = 0; i<friend[0].friendUserId.length; i++){
      User.count({'userId': friend[0].friendUserId[i]}, makeUserCheckedCallback(friend[0].friendUserId[i]));
    }
  };
  Friend.find({'userId':userId}, onFriendsRetrieved);
}

FriendService.prototype = {
  lookupFriend: lookupFriend,
  addFriends : addFriends,
  getFriends :  getFriends
};

var friendService = new FriendService();

module.exports = friendService;
