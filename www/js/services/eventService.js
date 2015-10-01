angular.module('pilares.eventService', [])
.factory('eventService', function($http, $ionicLoading) {
        var getEvents = function(day, month, year){
            var url = "http://www.zaragoza.es/api/recurso/cultura-ocio/evento-zaragoza.json?srsname=wgs84&rows=100&sort=subEvent.horaInicio%20desc&q=startDate=="+year+"-"+month+"-"+day+"T00:00:00Z";
            loading('Cargando programacion...');
            return $http({
                method: "GET",
                url: url
            }).success(function(){
                loadingHide();
            }).error(function(){
                loadingError();
            });
        };

        //

        var searchEvents = function(query, canceler){
            var url = "http://www.zaragoza.es/api/recurso/cultura-ocio/evento-zaragoza.json?srsname=wgs84&q=title=="+query+"*";
            loading('Realizando busqueda...');
            return $http.get(url,{timeout: canceler.promise}
            ).success(function(){
                loadingHide();
            }).error(function(){
                loadingError();
            });
        };

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

    return {
        getEvents: function(day, month, year) { return getEvents(day, month, year); },
        searchEvents: function(query, canceler){ return searchEvents(query, canceler); }
    };

});
