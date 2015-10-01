var userService =  require('../../../services/user/user-service');
var commentService =  require('../../../services/comment/comment-service');
function CommentController() {
}

function add(req, res, next) {
  var userId =req.body.userId;
  var accessToken = req.body.accessToken;
  var comment = req.body.comment;
  var eventId = req.body.eventId;
  //check params
  if(typeof (comment)=='undefined'||typeof (eventId)=='undefined'){
    return res.json({message:'No params'});
  }
  var onSuccess = function(){
    return res.json({message:'OK'});
  };
  var onError = function(){
    return res.json({message:'Error'});
  };
  var onAuthenticated = function(auth){
    if(auth){
      return commentService.addComment(userId, eventId, comment, onSuccess, onError);
    }else{
      return res.status(200).json({ message:"credentials not  OK"});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);
}


function get(req, res, next){
  //var userId =req.body.userId;
  //var accessToken = req.body.accessToken;
  var eventId = req.body.eventId;
  var userNameRequest = 0;
  var response = [];
  var makeUserNameSuccess = function(index){
    return function(userName){
      userNameRequest--;
      var item = response[index];
      item =
      {"userId" : item.userId,
        "eventId": item.eventId,
        "comment": item.comment,
        "userName": userName
      }
      response[index] = item;
      if(userNameRequest==0){
        return res.json(response);
      }
    }
  }
  var onCommentsSuccess = function(comments){
    userNameRequest = comments.length
    response = comments;
    for(var i = 0; i< comments.length; i++){
      userService.getUserName(comments[i].userId,makeUserNameSuccess(i), onError);
    }
  };
  var onError = function(){
    return res.json({message:'Error'});
  };
  return commentService.getComments(eventId, onCommentsSuccess, onError);
}

CommentController.prototype = {
  add: add,
  get: get
};

var commentController = new CommentController();

module.exports = commentController;
