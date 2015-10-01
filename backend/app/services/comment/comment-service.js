var Comment = require('../../models/comment');

function CommentService() {
}

function lookupComment(id) {
  return { id: id };
}

function addComment(userId, eventId, comment, successHandler, errorHandler){
  var onCommentSaved = function(err){
    if(err) return errorHandler();
    successHandler();
  };
  try {
    var item = new Comment();
    item.comment = comment;
    item.eventId = eventId;
    item.userId = userId;
    item.save(onCommentSaved);
  }catch(e){
    console.log(e);
    errorHandler();
  }
}

function getComments(eventId, successHandler, errorHandler){
  Comment.find({'eventId': eventId}, function(err, comments){
    if(err) errorHandler();
    successHandler(comments);
  })
}

CommentService.prototype = {
  lookupComment: lookupComment,
  addComment: addComment,
  getComments: getComments
};

var commentService = new CommentService();

module.exports = commentService;
