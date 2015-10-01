angular.module('pilares.detail', [])

.controller('DetailCtrl', function($scope, $stateParams, $rootScope, favService, socialService) {

        $scope.share = function(){

            var message = $scope.getDateFromJSON($rootScope.event.startDate)+" "+$rootScope.event.title+
                " en "+
                $scope.getLugar($rootScope.event)+
                " a las "+
                $scope.getHorario($rootScope.event);
           if($scope.isApp) {
               window.plugins.socialsharing.share(message);
           }else{
               var mail = 'mailto:tuamigo@email.com?subject=Fiestas del Pilar&body='+message;
               var newWin = window.open(mail);
               setTimeout(function(){newWin.close()}, 100);
           }
        };

        $scope.addFav = function(){
            favService.addFavEvent($rootScope.event);
            if($scope.loggedWithFB){
              socialService.addEvent($scope.fbUser.id,  $scope.accessToken, $rootScope.event, $rootScope.event.id);
            }
            $scope.isFavEvent = true;
        };

        $scope.removeFav = function(){
            favService.removeFavEvent($rootScope.event.id);
            if($scope.loggedWithFB){
              socialService.removeEvent($scope.fbUser.id,  $scope.accessToken, $rootScope.event.id);
            }
            $scope.isFavEvent = false;
        };

        $scope.comments = [];
        $scope.commentsError = false;
        $scope.gettingComments = false;
        $scope.getComments =function(){
          socialService.getComments($rootScope.event.id).then(function onSuccess(remote){
            console.log(JSON.stringify(remote));
              $scope.comments = remote.data.reverse();
              $scope.commentsError = false;
            $scope.gettingComments = false;
          }, function onError(){
              $scope.commentsError = true;
               $scope.gettingComments = false;
          });
        };

        $scope.addingComment = false;
        $scope.addComment = function(){
          $scope.addingComment = true;
          socialService.addComment($scope.fbUser.id,  $scope.accessToken, $rootScope.event.id, $scope.comment)
            .then(function onSuccess(){
              $scope.getComments();
              $scope.comment = null;
              $scope.addingComment = false;
            }, function onError(){
              $scope.notificate("Error", "Se ha producido un error vuelve a enviarlo");
              $scope.addingComment = false;
            })
        };
        $scope.getComments();
        $scope.isFavEvent = favService.isFavEvent($rootScope.event.id);
        console.log($scope.isFavEvent );

});
