angular.module('pilares.socialService', [])
.factory('socialService', function($http, $ionicLoading) {
    var host = "hostname",
        port = "9000";
    var loading = function(message){
      $ionicLoading.show({
        template: message
      });
    };

    var loadingHide = function(){
      $ionicLoading.hide();
    };

    var loadingError=function(){
      $ionicLoading.hide();
      $ionicLoading.show({ template: 'Se ha producido un error, comprueba la conexión y vuelve a intentarlo.', noBackdrop: true, duration: 3000 });
    };

    var getTimeline = function(userId, accessToken, timestamp){
        var url= "http://"+host+":"+port+"/v1/timeline";
        loading('Cargando eventos de tus amigos...');
        return $http.post(url,
          {userId:userId, accessToken:accessToken, timestamp:timestamp},
          {timeout: 10000}
        ).success(function(){
          loadingHide();
        }).error(function(){
          loadingError();
        });
    };


    var addToken = function(userId, accessToken, email, name){
      console.log("addToken"+userId);
      var url= "http://"+host+":"+port+"/v1/auth";
      return $http.post(url,
        {userId:userId, accessToken:accessToken, email:email, name:name},
        {timeout: 10000}
      );
    };

    var uploadFriends = function(userId, accessToken, ids){
      var url= "http://"+host+":"+port+"/v1/friend";
      return $http.post(url,
        {userId:userId, accessToken:accessToken, friendsIdJSON:JSON.stringify(ids)},
        {timeout: 10000}
      );
    };

    var addEvent = function(userId, accessToken, event, eventId){
      var url= "http://"+host+":"+port+"/v1/event/add";
      return $http.post(url,
        {userId:userId, accessToken:accessToken, event:JSON.stringify(event), eventId:eventId},
        {timeout: 10000}
      );
    };

    var removeEvent = function(userId, accessToken, eventId){
      var url= "http://"+host+":"+port+"/v1/event/remove";
      return $http.post(url,
        {userId:userId, accessToken:accessToken,  eventId:eventId},
        {timeout: 10000}
      );
    };

    var getRemoteEvents = function(userId, accessToken){
      var url= "http://"+host+":"+port+"/v1/timeline/fav";
      return $http.post(url,
        {userId:userId, accessToken:accessToken},
        {timeout: 10000}
      );
    };

    var getComments = function(eventId){
      var url= "http://"+host+":"+port+"/v1/comment/get";
      return $http.post(url,
        {eventId: eventId},
        {timeout: 10000}
      );
    };

    var addComment = function(userId, accessToken, eventId, comment){
      var url= "http://"+host+":"+port+"/v1/comment/add";
      return $http.post(url,
        {userId:userId, accessToken:accessToken, eventId: eventId, comment: comment},
        {timeout: 10000}
      );
    };
    return {
        getTimeline: function(userId, accessToken, timestamp){ return getTimeline(userId, accessToken, timestamp);},
        addToken : function(userId, accessToken, email, name){ return addToken(userId, accessToken, email, name)},
        uploadFriends: function(userId, accessToken, ids){ return uploadFriends(userId,accessToken, ids);},
        addEvent: function(userId, accessToken, event, eventId){ return addEvent(userId, accessToken, event, eventId);},
        removeEvent: function(userId, accessToken, eventId){return removeEvent(userId, accessToken, eventId);},
        getRemoteEvents:function(userId, accessToken){ return getRemoteEvents(userId,accessToken)},
        getComments: function(eventId){return getComments(eventId);},
        addComment: function(userId, accessToken, eventId, comment){return addComment(userId, accessToken, eventId, comment);}
    };

});
