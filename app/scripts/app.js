(function () {
  'use strict';

  var app = angular.module('cotizacionExpressApp', ['Express.services', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.router']);
  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict'
    $stateProvider.state('login', {
      url: '/login',
      views: {
        'maincontent': {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          resolve:{
            Session_resolve:function(Session){
              return Session.get();
            }
          }
        }
      }
    })
    .state('app', {
      url: '/',
      templateUrl: 'index.html'
    })
    .state('show', {
      url: '/show',
      views:{
        "maincontent":{
          templateUrl: 'views/CotizacionView.html',
          resolve:{
            cotizaciones: function (Cotizacion) {
              return Cotizacion.all().then(function(r){
                return r;
              });
            },
            clientes: function (Cliente) {
              return Cliente.all().then(function(c){
                return c;
              });
            },
            contenedores: function (Cotizacion) {
              return Cotizacion.contenedores().then(function(c){
                return c;
              });
            },
            materiales: function (Cotizacion) {
              return Cotizacion.materiales().then(function(c){
                return c;
              });
            },
            muebles: function (Cotizacion) {
              return Cotizacion.muebles().then(function(c){
                return c;
              });
            }
          },
        controller:'CotizacionViewCtrl'
        }
      }
    })
    .state('cotizacion', {
      url: '/cotizacion',
      views: {
        'maincontent': {
          templateUrl: 'views/cliente.html',
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
    // $urlRouterProvider.otherwise('/show');
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
