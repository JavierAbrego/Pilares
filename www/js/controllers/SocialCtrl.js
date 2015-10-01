angular.module('pilares.social', ['ngOpenFB'])

.controller('SocialCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $timeout, ngFB, socialService) {
    $scope.timeline = [];
    $scope.fbLogin = function () {
      console.log("haciendo login");
      if($rootScope.inIframe()){
        window.open("http://pilares.bigdata.gs/#/app/social", "foo", "toolbar=yes,location=yes,menubar=yes");
        return;
      }
        ngFB.login({scope: 'email,publish_actions, user_friends'}).then(
          function (response) {
            if (response.status === 'connected') {
              $scope.setAccessToken(response.authResponse.accessToken);
              getUserData();
              console.log('Facebook login succeeded');
              convertTokenToLongLived(response.authResponse.accessToken);
            } else {
              $scope.notificate("FB error", 'Revisa tus datos de login por favor.');
            }
          });
    };

    function convertTokenToLongLived(token){
      ///oauth/access_token?
      //  grant_type=fb_exchange_token&
      //  client_id={app-id}&
      //  client_secret={app-secret}&
      //  fb_exchange_token={short-lived-token}
        ngFB.api({
            path: "/oauth/access_token",
            params:{grant_type: "fb_exchange_token", client_id:"406977766180078",client_secret:"secret",fb_exchange_token:token  }
          }
        ).then(
          function (response) {
           console.log(JSON.stringify(response));
          });
    }

    function getUserData(){
      ngFB.api({
        path: '/me',
        params: {fields: 'id,name,email'}
      }).then(
        function (user) {
          $scope.setFBUser(user);
          console.log(JSON.stringify(user));
          addRemoteAuth();
        },
        function (error) {
          $scope.notificate("Error",'Facebook error: ' + error.error_description);
        });
    }

    function addRemoteAuth(){
      var user = $scope.fbUser;
      socialService.addToken(user.id,$scope.accessToken, user.email, user.name).then($scope.getFriends, function onError(){
        $scope.accessToken = "";
        $scope.loggedWithFB = false;
        $scope.sessionExpired = false;
        localStorage.removeItem("accessToken");
        $scope.notificate("Error","Se ha producido un error comprueba tu conexión");
      });

    }

    $scope.getFriends = function(){
      ngFB.api({
        path: '/me/friends'
      }).then(
        function (friends) {
          if(typeof(friends.data)!='undefined'){
            var ids = [];
            for(var i = 0;i<friends.data.length;i++){
              ids.push(friends.data[i].id);
            }
            uploadFriends(ids);
          }else{
            $scope.getTimeline();
          }
          console.log(JSON.stringify(friends));
        },
        function (error) {
          console.log(JSON.stringify(error));
          if(error.type=="OAuthException"){
            $scope.sessionExpired = true;
            $scope.loggedWithFB = false;
          }else{
            $scope.notificate("Error",'Facebook error: ');
          }

        });
    };

    var uploadFriends = function(ids){
      socialService.uploadFriends($scope.fbUser.id, $scope.accessToken, ids).then(function(){
          //success
          $scope.getTimeline();
      }, function(){
        //error
      });
    };

    $scope.getTimeline = function(){
      socialService.getTimeline($scope.fbUser.id, $scope.accessToken, new Date().getTime()).then(function(data){
        $scope.timeline = data.data.message;
        for(var i = 0; i<$scope.timeline.length;i++){
          $scope.timeline[i].eventData.event = JSON.parse($scope.timeline[i].eventData.event);
        }
        console.log("timeline retrieved");
        console.log($scope.timeline );
        $scope.$broadcast('scroll.refreshComplete');
      }, onError);
    };

    function onError(){
      $scope.notificate("Error","Se ha producido un error comprueba tu conexión");
      $scope.$broadcast('scroll.refreshComplete');
    }

    if($scope.loggedWithFB){
      $scope.getFriends();
    }
});
