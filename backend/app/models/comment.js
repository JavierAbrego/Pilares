var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema   = new Schema({
  userId: String,
  eventId: String,
  comment: String,
});


module.exports = mongoose.model('Comment', CommentSchema);
