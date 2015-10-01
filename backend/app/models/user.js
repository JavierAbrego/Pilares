var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
  userId: String,
  name: String,
  email: String,
  accessToken: [String]
});

//UserSchema.index({userId: 1, accessToken: 1}, {unique: true, dropDups: true });
UserSchema.index({userId: 1}, {unique: true, dropDups: true });

module.exports = mongoose.model('User', UserSchema);
