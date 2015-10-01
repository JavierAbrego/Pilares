angular.module('pilares.search', [])

.controller('SearchCtrl', function($scope, $stateParams, eventService, $q, $timeout) {
        $scope.events = [];
        $scope.noResults = false;
        $scope.query = "";
        $scope.searchEvents = function(query){
            eventService.searchEvents(query,( $scope.canceler = $q.defer()) ).success(function(data, status, headers, config){
                if( typeof(data.result)!='undefined'){
                    $scope.events = data.result;
                    $scope.noResults = false;
                }else{
                    $scope.events = [];
                    $scope.noResults =true;
                }
            }).error(function(data, status, headers, config){
                console.log("error en busqueda");
            });
        };
        $scope.canceler;
        $scope.numberRequests = 0;
        $scope.$watch('attrs.query', function () {
            if(typeof ($scope.canceler)!='undefined'){
                $scope.canceler.resolve()
            }
            $timeout(function() {
                $scope.canceler = $q.defer();
            },100);
            $timeout(function(){
                console.log($scope.query);
                $scope.searchEvents($scope.query, $scope.canceler);
            },1000);

        });
});
