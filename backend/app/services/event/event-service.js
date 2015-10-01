var Event = require('../../models/event');
var FavEvent = require('../../models/favEvent');
var Friend = require('../../models/friend');
var User = require('../../models/user');

function EventService() {
}

function lookupEvent(id) {
  return { id: id };
}

function addFavEvent(event, eventId, userId, successHandler, errorHandler){
  //check if event exists
  var onEventCount = function(err, count){
    console.log(count);
    if(count>0){
      saveFavEvent();
    }else{
      saveEvent();
    }
  };
  Event.count({eventId: eventId}, onEventCount);


  var saveEvent = function(){
    var item =  new Event();
    item.event = event;
    item.eventId = eventId;
    item.save(saveEventCompleted)
  };

  var saveEventCompleted = function(err){
    if(err){
      return errorHandler();
    }else{
      saveFavEvent();
    }
  };

  var saveFavEvent = function(){
    //check if favorited items for userId exists
    FavEvent.count({'userId' : userId, 'eventId': eventId},function(err, count){
      if(err) return errorHandler();
      if(count>0){
        updateFavEvent();
      }else{
        createFavEvent();
      }
    });
  };

  var updateFavEvent = function(){
    FavEvent.findOneAndUpdate({ 'userId': userId }, {'timeline': new Date().getTime()},saveFavEventCompleted);
  };

  var createFavEvent = function(){
    var item = new FavEvent();
    item.eventId = eventId;
    item.userId = userId;
    item.timestamp = new Date().getTime();
    item.save(saveFavEventCompleted);
  };


  var saveFavEventCompleted = function(err){
    if(err){
      errorHandler(err);
    }else{
      successHandler();
    }
  };
}

function removeFavEvent(eventId, userId, successHandler, errorHandler){
  var saveFavEventCompleted = function(err){
    if(err){
      errorHandler(err);
    }else{
      successHandler();
    }
  };
  FavEvent.find({ 'userId': userId , 'eventId': eventId}).remove(saveFavEventCompleted);
}


function getFavEvents(userId, beforeTimestamp,limit, successHandler, errorHandler){
  var onFavEventsRetrieved = function(err, favEvents){
    if(err) errorHandler();
    //TODO recuperar informacion de cada evento
    successHandler(favEvents);
  };
  FavEvent.find({'userId':userId, 'timestamp':{$lt:beforeTimestamp}})
    .sort({ timestamp: -1 })
    .limit(20)
    .exec(onFavEventsRetrieved);
}

function getEventInformation(eventId, successHandler, errorHandler){
  Event.find({'eventId' : eventId}, function(err, data){
    if(err) errorHandler();
    successHandler(data);
  });
}

EventService.prototype = {
  lookupEvent: lookupEvent,
  addFavEvent: addFavEvent,
  removeFavEvent: removeFavEvent,
  getFavEvents: getFavEvents,
  getEventInformation: getEventInformation
};

var eventService = new EventService();

module.exports = eventService;
