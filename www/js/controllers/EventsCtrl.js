angular.module('pilares.events', ['pilares.eventService'])

.controller('EventsCtrl', function($scope, $rootScope, $stateParams, eventService, $location, $ionicTabsDelegate, $window, $document) {
        if($location.path()=="/app/events"){
            $ionicTabsDelegate.select(0);
        }else{
            $ionicTabsDelegate.select(1);
        }
        $rootScope.currentDate = (typeof($rootScope.currentDate)=='undefined') ? new Date() : $rootScope.currentDate;
        $scope.events;
        $scope.day;
        $scope.month;
        $scope.year;
        $scope.dayName;
        $scope.getEvents = function(){
            $scope.day= $rootScope.currentDate.getDate();
            $scope.month = $rootScope.currentDate.getMonth()+1;
            $scope.year = $rootScope.currentDate.getFullYear();
            $scope.dayName = $scope.getDayName($rootScope.currentDate);
            eventService.getEvents($scope.day, $scope.month, $scope.year).success(function(data, status, headers, config){
               var dynamicMarkers = [];
                $scope.events = data.result;
                //update map markers
                for(var i = 0; i<$scope.events.length; i++){
                    var event = $scope.events[i];
                    if(typeof (event)!='undefined'){
                        if(typeof(event.geometry)!='undefined'){
                            if(typeof(event.geometry.coordinates)!='undefined') {

                                var marker = {id: event.id,
                                    latitude: event.geometry.coordinates[1],
                                    longitude: event.geometry.coordinates[0],
                                    title: event.title,
                                    event: event,
                                    options:{labelClass:'marker_labels',labelAnchor:'12 60',labelContent: $scope.stripHTML(event.title)}
                                    };
                                dynamicMarkers.push(marker);
                            }
                        }
                    }

                }
                $scope.map.dynamicMarkers = dynamicMarkers;
            }).error(function(data, status, headers, config){
                console.log("error recibiendo eventos");
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.getDayName = function(date){
            var week = [];
            week[0] = "Domingo,";
            week[1] = "Lunes,";
            week[2] = "Martes,";
            week[3] = "Miércoles,";
            week[4] = "Jueves,";
            week[5] = "Viernes,";
            week[6] = "Sábado,";
            return week[date.getDay()];
        };

        $scope.nextDay = function(){
            $rootScope.currentDate.setDate($rootScope.currentDate.getDate()+1);
            $scope.getEvents();
        };

        $scope.previousDay = function(){
            $rootScope.currentDate.setDate($rootScope.currentDate.getDate()-1);
            $scope.getEvents();
        };



        //setup map
        $scope.map = { center: { latitude: 41.6601118, longitude: -0.8796984}, zoom: 14, dynamicMarkers: [] };
        $scope.markersEvents = {
            click: function (gMarker, eventName, model) {
                $scope.goToEvent(model.event);
            }
        };
        $(".angular-google-map-container").css("height", ($window.innerHeight-46-44-44));

        //getEvents
        $scope.getEvents();

});
