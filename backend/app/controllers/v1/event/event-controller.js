var userService =  require('../../../services/user/user-service');
var eventService =  require('../../../services/event/event-service');
var Event = require('../../../models/event');
var FavEvent = require('../../../models/favEvent');
var Friend = require('../../../models/friend');
var User = require('../../../models/user');

function EventController() {
}

function add(req, res, next){
  var userId = req.body.userId;
  var accessToken = req.body.accessToken;
  var event= req.body.event;
  var eventId = req.body.eventId;
  //check params
  if(typeof (event)=='undefined'||typeof (eventId)=='undefined'){
    return res.json({message:'No params'});
  }

  var message = "";

  var onAuthenticated = function(auth){
    if(auth){
      message = "credential OK";
      return eventService.addFavEvent(event,eventId,userId, onFavoritedEvent, onFavoritedEventError);
    }else{
      message = "credentials not  OK";
      return res.status(200).json({ message:message});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);

  var onFavoritedEvent = function(){
    return res.status(200).json({ message:"OK"});
  };

  var onFavoritedEventError = function(err){
    console.log(JSON.stringify(err));
    return res.status(200).json({ message:"Error"});
  }
}


function remove(req, res, next){
  var userId = req.body.userId;
  var accessToken = req.body.accessToken;
  var eventId = req.body.eventId;
  //check params
  if(typeof (userId)=='undefined'||typeof (eventId)=='undefined'){
    return res.json({message:'No params'});
  }
  var message = "";
  var onAuthenticated = function(auth){
    if(auth){
      message = "credential OK";
      return eventService.removeFavEvent(eventId,userId, successHandler, errorHandler);
    }else{
      message = "credentials not  OK";
      return res.status(200).json({ message:message});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);

  var successHandler = function(){
    return res.status(200).json({ message:"OK"});
  };

  var errorHandler = function(){
    return res.status(200).json({ message:"Error"});
  };
}

EventController.prototype = {
  add: add,
  remove: remove
};

var eventController = new EventController();

module.exports = eventController;
