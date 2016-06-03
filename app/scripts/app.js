(function () {
  'use strict';

  var app = angular.module('cotizacionExpressApp', ['Express.services', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.router']);
  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // 'use strict'
    $stateProvider.state('login', {
      url: '/login',
      views: {
        'maincontent': {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        }
      }
    }).state('app', {
      url: '/',
      templateUrl: 'index.html'
    }).state('cotizacion', {
      url: '/cotizacion',
      views: {
        'maincontent': {
          templateUrl: 'views/cliente.html',
          // templateUrl:'views/cotizacion.html',
          controller: 'CotizacionCtrl',

          resolve: {
            muebles_resolve: function (API, Mueble) {
              return Mueble.all().then(function (r) {
                return r;
              });
            },
            contenedores_resolve: function (API, Contenedor) {
              return Contenedor.all().then(function (r) {
                return r;
              });
            }
          }
        }
      }
    });
    $urlRouterProvider.otherwise('/login');
  }]);
  app.constant('setting', {
    "url": "http://localhost:8000/api/v1/",
    //"url":"http://192.168.0.115:8000/api/v1/",
    "user": { "name": "admin", "pass": "admin" }
  });
  app.service('Session', function () {
    var session = false;
    return {
      get: function () {
        return session;
      },
      set: function (bool) {
        session = bool;
        return session;
      }
    };
  });
})();
