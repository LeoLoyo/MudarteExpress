// (function() {
var session = false;
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
      .state('login',{
        url:'/login',
        views:{
          'maincontent':{
            templateUrl:'/views/login.html',
            controller:'LoginCtrl'
          }
        }
      })

      .state('app', {
        url: '/',
        // abstract: true,
        templateUrl: 'index.html',
        controller:'LoginCtrl'
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
      $urlRouterProvider.otherwise('/login');
      $urlRouterProvider.otherwise('/cotizacion');
    });
    app.constant('setting',{
      // "url":"http://localhost:8000/api/v1/"
      "url":"http://192.168.0.114:8000/api/v1/",
      "user":{"name":"admin","pass":"admin"}
    });

// })();
