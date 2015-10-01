var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FavEventSchema   = new Schema({
  userId: String,
  eventId: String,
  timestamp : Number
});

module.exports = mongoose.model('FavEvent', FavEventSchema);
