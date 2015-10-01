var userService =  require('../../../services/user/user-service');
var friendService =  require('../../../services/friend/friend-service');
var eventService =  require('../../../services/event/event-service');


function TimelineController() {
}

function post(req, res, next) {
  console.log("timeline!");
  console.log(JSON.stringify(req.body));
  var userId =req.body.userId;
  var accessToken = req.body.accessToken;
  var timestamp = req.body.timestamp;

  //check params
  if(typeof (userId)=='undefined'){
    return res.json({message:'No params'});
  }
  if(typeof (timestamp)=='undefined'){
    timestamp =  new Date().getTime();
  }

  var onError = function(){
    return res.json({message:'Error'});
  };
  var favEvents = [];
  var response = [];
  var numFavRequests = 0;
  var eventInformationRequests = 0;
  var userNameRequests = 0;
  var onFriendsRetrieved = function(friendIds){
    //get fav events of friends in array where timestamp <
    numFavRequests = friendIds.length+1;
    for(var i = 0; i<friendIds.length; i++){
      var limit = 100;
      eventService.getFavEvents(friendIds[i], timestamp, limit, onFavEventsRetrieved, onError);
    }
    eventService.getFavEvents(userId, timestamp, limit, onFavEventsRetrieved, onError);
  };

  var onFavEventsRetrieved = function(events){
    console.log("onFavEventsRetrieved");
    favEvents = favEvents.concat(events);
    numFavRequests--;
    if(numFavRequests==0){
      var sortCriteria = function(a,b){
        return b.timestamp- a.timestamp;
      }
      favEvents = favEvents.sort(sortCriteria);
      if(favEvents.length==0){
        return res.json({message: favEvents});
      }
      retrieveEventsInformation();
    }
  };

  var makeRetrieveInformationCallback = function(index){
    return function(data) {
      eventInformationRequests--;
      var item =  {"event":favEvents[index], "eventData": data[0]};
      favEvents[index] = item;
      if (eventInformationRequests == 0) {
        retrieveUserName();
      }
    }
  };

  var retrieveEventsInformation = function(){
    for(var i = 0; i<favEvents.length; i++){
      eventInformationRequests++;
      eventService.getEventInformation(favEvents[i].eventId, makeRetrieveInformationCallback(i), onError);
    }
  };

  var makeUserNameRetrievedCallback = function(index){
    return function(userName){
      userNameRequests--;
      var item =  {"event":favEvents[index].event, "eventData": favEvents[index].eventData, "userName":userName};
      console.log(userName);
      favEvents[index] = item;
      if (userNameRequests == 0) {
        return res.json({message: favEvents});
      }
    }
  }
  var retrieveUserName =function(){
    userNameRequests = favEvents.length;
    for(var i = 0; i<favEvents.length; i++){
      userService.getUserName(favEvents[i].event.userId, makeUserNameRetrievedCallback(i), onError);
    }
  };

  var onAuthenticated = function(auth){
    if(auth){
      //obtain friends of userID
      friendService.getFriends(userId, onFriendsRetrieved, onError);
    }else{
      return res.status(200).json({ message:"credentials not  OK"});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);
}

function favEvents(req, res, next){
  var userId =req.body.userId;
  var accessToken = req.body.accessToken;
  var favEvents = [];
  var eventInformationRequests = 0;
  var onAuthenticated = function(auth){
    if(auth){
      eventService.getFavEvents(userId, new Date().getTime(), 2000, onFavEventsRetrieved, onError);
    }else{
      return res.status(200).json({ message:"credentials not  OK"});
    }
  };
  userService.checkCredentials(userId, accessToken, onAuthenticated);

  var onError = function(){
    return res.json({message:'Error'});
  };

  var onFavEventsRetrieved = function(events){
    favEvents = events;
    var sortCriteria = function(a,b){
      return b.timestamp- a.timestamp;
    }
    favEvents = favEvents.sort(sortCriteria);
    if(favEvents.length==0){
      return res.json({message: favEvents});
    }
    retrieveEventsInformation();
  };

  var makeRetrieveInformationCallback = function(index){
    return function(data) {
      eventInformationRequests--;
      var item =  {"event":favEvents[index], "eventData": data[0]};
      favEvents[index] = item;
      if (eventInformationRequests == 0) {
        return res.json({message: favEvents});
      }
    }
  };

  var retrieveEventsInformation = function(){
    for(var i = 0; i<favEvents.length; i++){
      eventInformationRequests++;
      eventService.getEventInformation(favEvents[i].eventId, makeRetrieveInformationCallback(i), onError);
    }
  };
}

TimelineController.prototype = {
  post: post,
  favEvents: favEvents
};

var timelineController = new TimelineController();

module.exports = timelineController;
