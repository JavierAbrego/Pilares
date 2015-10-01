var friendService =  require('../../../services/friend/friend-service');
var userService =  require('../../../services/user/user-service');

function FriendController() {
}

function addFriends(req, res, next) {
  console.log(req.body.friendsIdJSON);
  var friendsId = JSON.parse(req.body.friendsIdJSON);
  var userId = req.body.userId;
  var accessToken  = req.body.accessToken;

  var onAuthenticated = function(auth){
    if(auth){
      return friendService.addFriends(userId, friendsId, onFriendsAdded, onError);
    }else{
      return res.status(200).json({ message: "credentials not  OK"});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);

  var onFriendsAdded = function(){
    res.status(200).json({ message: 'OK' });
  };

  var onError = function(){
    res.status(200).json({ message: 'Error' });
  };


}

FriendController.prototype = {
  post: addFriends
};

var friendController = new FriendController();

module.exports = friendController;
