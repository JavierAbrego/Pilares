angular.module('pilares.directions', [])
.controller('DirectionsCtrl', function($scope, $stateParams, $rootScope,$ionicLoading, $window) {

        $scope.loading = $ionicLoading.show({
            template: '<button class="button button-clear" style="line-height: normal; min-height: 0; min-width: 0;" ng-click="$root.cancel()"><i class="ion-close-circled"></i></button> Obteniendo ubicación...'
        });
        try {
            navigator.geolocation.getCurrentPosition(function (position) {
                try {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.pos = {
                        lat: pos["H"],
                        lng: pos["L"]
                    };

                    var directionsDisplay;
                    var directionsService = new google.maps.DirectionsService();
                    var map;

                    directionsDisplay = new google.maps.DirectionsRenderer();
                    var inticor = new google.maps.LatLng($scope.pos.lat, $scope.pos.lng);
                    var mapOptions =
                    {
                        zoom: 9,
                        center: inticor,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
                    directionsDisplay.setMap(map);
                    var start = new google.maps.LatLng($scope.pos.lat, $scope.pos.lng);
                    var end = new google.maps.LatLng($rootScope.event.geometry.coordinates[1], $rootScope.event.geometry.coordinates[0]);
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        }
                    });
                }catch(mapError){
                    console.log(mapError);
                    $scope.notificate("Ruta", "Ruta no disponible");
                    $ionicLoading.hide();
                    window.history.back();
                }
                $ionicLoading.hide();
            }, //On Error
                function(){
                    $scope.notificate("Posicion", "Activa la posición GPS para tener acceso a esta funcionalidad.");
                    $ionicLoading.hide();
                    var inticor = new google.maps.LatLng($rootScope.event.geometry.coordinates[1], $rootScope.event.geometry.coordinates[0]);
                    var mapOptions =
                    {
                        zoom: 17,
                        center: inticor,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
                    var marker = new google.maps.Marker({
                        position: inticor,
                        map: map,
                        title: $rootScope.event.title
                    });
                }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: false });
        }catch(geolocateError){
            console.log(geolocateError);
            $scope.notificate("Ruta","No se puede obtener la ubicacion");
            window.history.back();
            $ionicLoading.hide();
        }
        $(".angular-google-map-container").css("height", ($window.innerHeight-44-49));

        $scope.launchNavigator = function(){
            try{
            if(typeof(launchnavigator)=='undefined'){
                window.location = "maps://?q="+$rootScope.event.geometry.coordinates[1]+","+$rootScope.event.geometry.coordinates[0];
                return;
            }
            launchnavigator.navigate(
                [$rootScope.event.geometry.coordinates[1], $rootScope.event.geometry.coordinates[0]],
                null,
                function(){
                    console.log("Plugin success");
                },
                function(error){
                    console.log("Plugin error: "+ error);
                });
            }catch(e){
                $scope.notificate("Navegador","No hay posicion disponible");
            }
        };

});
