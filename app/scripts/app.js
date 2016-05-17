(function() {
  'use strict';
  var app = angular.module('cotizacionExpressApp', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.router'
    ]);
    app.config(function($stateProvider, $urlRouterProvider){
      $stateProvider
      .state('app',{
        url:'/',
        templateUrl:'index.html'
      })
      .state('login',{
        url:'/login',
        views:{
          'maincontent':{
            templateUrl:'/views/login.html',
            controller:'LoginCtrl'
          }
        }
      })

      $urlRouterProvider.otherwise('/');
    });
})();
