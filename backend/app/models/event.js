var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema   = new Schema({
  eventId: { type: String, unique : true, required : true, dropDups: true },
  event: String
});

module.exports = mongoose.model('Event', EventSchema);
