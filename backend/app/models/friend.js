var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FriendSchema   = new Schema({
  userId: String,
  friendUserId: [String]
});

FriendSchema.index({userId: 1}, {unique: true, dropDups: true });

module.exports = mongoose.model('Friend', FriendSchema);
