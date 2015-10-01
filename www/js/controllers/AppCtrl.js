angular.module('pilares.app', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, $rootScope, $location, favService, socialService) {

        $rootScope.isApp = (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf( 'chrome-extension://' ) === -1);
        $rootScope.isChrome = (document.URL.indexOf( 'chrome-extension://' ) != -1);
        $rootScope.inIframe = function(){
          try {
            return window.self !== window.top;
          } catch (e) {
            return true;
          }
        };
        $rootScope.errorPhoto = "img/no-photo.jpg";
        if($rootScope.isChrome){
          $rootScope.errorPhoto =  chrome.extension.getURL("/img/no-photo.jpg");
          document.body.style.height = "600px";
          document.body.style.width = "500px";
        }
        $scope.isDefined = function(variable){
            return typeof(variable) != 'undefined';
        };

        $scope.navigateTo=function(url){
          window.location = url;
        };

        //FB Integration
        $scope.accessToken = localStorage.getItem("accessToken");
        if(localStorage.getItem("fbUser")!=null){
          $scope.fbUser = JSON.parse(localStorage.getItem("fbUser"));
        }
        $scope.accessToken = localStorage.getItem("accessToken");
        $scope.loggedWithFB = (localStorage.getItem("accessToken")!=null);
        $scope.sessionExpired = false;
        $scope.setAccessToken = function(token){
          $scope.accessToken = token;
          $scope.loggedWithFB = true;
          $scope.sessionExpired = false;
          localStorage.setItem("accessToken", token);
        };

        $scope.setFBUser = function(user){
          localStorage.setItem("fbUser", JSON.stringify(user));
          $scope.fbUser = user;
        };

        $scope.events = [];
        $scope.getFavEvents = function(){
          $scope.events = favService.getFavEvents();
          if($scope.loggedWithFB) {
            socialService.getRemoteEvents( $scope.fbUser.id, $scope.accessToken)
              .then(function onSuccess(remote){
                remote = remote.data.message;
                for(var i = 0; i<remote.length; i++){
                  var event = JSON.parse(remote[i].eventData.event);
                  if(remoteEventIsNotInEvents(event)) {
                    $scope.events.push(event);
                  }
                }
            });
          }
        };

        function remoteEventIsNotInEvents(event){
          console.log("eventos+"+$scope.events.length);
          for(var i =0; i< $scope.events.length; i++){
            console.log($scope.events[i].id+"=="+event.id);
            if($scope.events[i].id==event.id){
              return false;
            }
          }
          return true;
        }

        $scope.getFavEvents();


        $scope.getHorario = function(event){
            var is = $scope.isDefined;
            try {
                if (is(event)) {
                    if (is(event.subEvent[0].horario)) {
                        return event.subEvent[0].horario;
                    }
                    if (is(event.subEvent[0].horaInicio)) {
                        return event.subEvent[0].horaInicio;
                    }
                }
            }catch(e){
                return "Horario sin especificar";
            }
            return "Horario sin especificar";
        };

        $scope.stripHTML = function(string){
            if(typeof(string)=='undefined'){
                return "";
            }
            var div = document.createElement("div");
            div.innerHTML = string;
            var text = div.textContent || div.innerText || "";
            return text;
        };

        $scope.getLugar = function(event){
                try{
                    return " - "+event.subEvent[0].lugar.title;
                }catch(e){
                    return "";
                }

        };

        $scope.notificate = function(title, message){
            if($scope.isApp){
                navigator.notification.alert(
                    message,
                    function(){},         // callback
                    title,
                    'OK'
                );
            }else {
              alert(message);
            }
        };


        $rootScope.cancel = function(){
            $ionicLoading.hide();
            window.history.back();
        };

        $scope.goToEvent = function(event){
            $rootScope.event = event;
            var url = "/app/detail/"+event.id;
            $location.path(url);
        };

        $scope.getDateFromJSON = function(startDate){
            if(typeof (startDate)=='undefined'){
                return "";
            }
            var date = new Date(startDate);
            return  date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        };

});
