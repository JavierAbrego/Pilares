// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('pilares', ['ionic', 'ngOpenFB', 'pilares.app', 'pilares.detail',  'pilares.events', 'pilares.fav', 'pilares.directions', 'pilares.search', 'pilares.eventService', 'pilares.socialService', 'uiGmapgoogle-maps', 'pilares.favService','pilares.social'])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '406977766180078', tokenStore: window.localStorage});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })
    .state('app.events', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
        }
      }
    })

    .state('app.eventsMap', {
    url: '/eventsMap',
    views: {
      'menuContent': {
        templateUrl: 'templates/eventsMap.html',
        controller: 'EventsCtrl'
      }
    }
  })
    .state('app.fav', {
      url: '/fav',
      views: {
        'menuContent': {
          templateUrl: 'templates/fav.html',
          controller: 'FavCtrl'
        }
      }
    })

  .state('app.detail', {
    url: '/detail/:detailId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
      }
    }
  })
  .state('app.directions', {
      url: '/directions',
      views: {
        'menuContent': {
          templateUrl : 'templates/directions.html',
          controller: 'DirectionsCtrl'
        }
      }
  }).state('app.social', {
      url: '/social',
      views: {
        'menuContent': {
          templateUrl : 'templates/social.html',
          controller: 'SocialCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/events');
});
