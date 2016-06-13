(function () {
  'use strict';

  var app = angular.module('cotizacionExpressApp', ['Express.controllers', 'Express.services', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.router']);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict';

    $stateProvider.state('login', {
      url: '/login',
      views: {
        'maincontent': {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          resolve: {
            Session_resolve: function (Session) {
              return Session.get();
            }
          }
        }
      }
    }).state('app', {

      url: '/',

      templateUrl: 'index.html'

    }).state('list', {

      url: '/list',

      views: {

        "maincontent": {

          templateUrl: 'views/CotizacionView.html',

          controller: 'CotizacionViewCtrl',

          resolve: {

            cotizaciones: function (API, Cotizacion) {

              return Cotizacion.all().then(function (r) {

                return r;
              });
            },
            clientes: function (API, Cliente) {

              return Cliente.all().then(function (r) {

                return r;
              });
            },
            muebles: function (API, Cotizacion) {

              return Cotizacion.muebles().then(function (r) {

                return r;
              });
            },
            materiales: function (API, Cotizacion) {

              return Cotizacion.materiales().then(function (r) {

                return r;
              });
            },
            contenedores: function (API, Cotizacion) {

              return Cotizacion.contenedores().then(function (r) {

                return r;
              });
            }

          }
        }

      }

    }).state('show', {

      url: '/show/:id_cotizacion',

      views: {

        "maincontent": {

          templateUrl: 'views/resumen.html',

          controller: 'ShowCtrl'

        }
      }
    }).state('cotizacion', {

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
            },
            materiales_resolve: function (API, Material) {
              return Material.all().then(function (r) {
                var out = [];
                angular.forEach(r, function (v, k) {
                  var m = angular.copy(v);
                  m.precio = Number(m.precio);
                  m.cantidad = 0;
                  m.ncontenedor = 0;
                  m.contenedor = false;
                  out.push(m);
                }, out);
                return out;
              });
            }
          }
        }
      }
    });
    // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/list');
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

  angular.module('Express.controllers', ['Backend']);
})();
