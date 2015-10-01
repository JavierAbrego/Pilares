angular.module('pilares.fav', [])

.controller('FavCtrl', function($scope, $stateParams, favService) {

    $scope.events = favService.getFavEvents();


});
