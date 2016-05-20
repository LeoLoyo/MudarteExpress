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
        abstract: true,
        templateUrl: 'index.html'
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
      // .state('resumen',{
      //   url:'/resumen',
      //   views:{
      //     'maincontent':{
      //       templateUrl:'/views/resumen.html',
      //       controller:'ResumenCtrl'
      //     }
      //   }
      // })

      $urlRouterProvider.otherwise('/cotizacion');
    });
})();
