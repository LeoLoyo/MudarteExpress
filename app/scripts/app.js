(function() {
  'use strict';
  var app = angular.module('cotizacionExpressApp', [
    'Express.services',
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
      .state('cotizacion',{
        url:'/cotizacion',
        views:{
          'maincontent':{
            templateUrl:'/views/cotizacion.html',
            controller:'CotizacionCtrl'
          }
        }
      })

      $urlRouterProvider.otherwise('/');
    });
})();
