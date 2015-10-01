angular.module('pilares.favService', [])
    .factory('favService', function($http, $ionicLoading) {
        var storage = "favItems";
        var favStorage = (localStorage.getItem(storage)==null) ? [] : JSON.parse(localStorage.getItem(storage));

        var getFavEvents = function(){
          return  favStorage.sort(function(a,b){
                return new Date(a.startDate)- new Date(b.startDate);
            });
        };

        var addFavEvent = function(event){
            favStorage.push(event);
            saveStorage();
        };

        var removeFavEvent = function(idEvent){
            for(var i = 0; i<favStorage.length; i++){
                if(favStorage[i].id===idEvent){
                    favStorage.splice(i,1);
                    saveStorage();
                    break;
                }
            }
        };

        var isFavEvent = function(idEvent){
            for(var i = 0; i<favStorage.length; i++){
                if(favStorage[i].id===idEvent){
                    return true;
                }
            }
            return false;
        };

        var saveStorage = function(){
            localStorage.setItem(storage, JSON.stringify(favStorage));
        };

    return {
        getFavEvents: getFavEvents,
        addFavEvent: addFavEvent,
        removeFavEvent: removeFavEvent,
        isFavEvent : isFavEvent
    };
});
