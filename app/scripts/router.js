(function (){

  var route = angular.module('Express.router', ['ui.router']);

  route.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict';

    $stateProvider

    .state('login', {
      url: '/login',
      views: {
        'maincontent': {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          resolve: {
            Session_resolve: function (Session, $state) {
              if(Session.get()){
                  $state.go($state.current.name);
              }
              return Session.get();
            }
          }
        }
      }
    }).state('app', {

      url: '/',

      templateUrl: 'index.html'

    }).state('list', {

      cache:true,

      url: '/list',

      views: {

        "maincontent": {

          templateUrl: 'views/CotizacionView.html',

          controller: 'CotizacionViewCtrl',

          resolve: {
            Session_resolve: function (Session, $state, $rootScope) {

              if(Session.get()){
                $('.btnsCotizacion').addClass('hidden');
                  $rootScope.nav = '7';

              }else{
                $state.go('login');
              }

              return Session.get();
            }
          }
        }

      }

    }).state('edit', {

      url: '/edit/:id_cotizacion',

      cache:true,

      views: {

        "maincontent": {

          templateUrl: 'views/cliente.html',

          controller: 'EditCtrl',

          resolve: {
            Session_resolve: function (Session, $state, $rootScope) {

              if(Session.get()){
                $('.btnsCotizacion').removeClass('hidden');
                $('.cargando').removeClass('hidden');
                  $rootScope.nav = '10'
              }else{
                $state.go('login');
              }

              return Session.get();
            }
          }

        }
      }
    }).state('show', {

      url: '/show/:id_cotizacion',

      cache:true,

      views: {

        "maincontent": {

          templateUrl: 'views/resumen.html',

          controller: 'ShowCtrl',

          resolve: {
            Session_resolve: function (Session, $state, $rootScope) {

              if(Session.get()){
                $('.btnsCotizacion').addClass('hidden');
                  $rootScope.nav = '8';

              }else{
                $state.go('login');
              }

              return Session.get();
            }
          }

        }
      }
    }).state('cotizacion', {

      cache:true,

      url: '/cotizacion',

      views: {

        'maincontent': {

          templateUrl: 'views/cliente.html',

          controller: 'CotizacionCtrl',

          resolve: {
            Session_resolve: function (Session, $state, $rootScope) {

              if(Session.get()){

                $('.btnsCotizacion').removeClass('hidden');
                $('.cargando').removeClass('hidden');

                  $rootScope.nav = '1';

              }else{
                $('.btnsCotizacion').addClass('hidden');
                $state.go('login');
              }

              return Session.get();
            }
          }
        }
      }
    });
    $urlRouterProvider.otherwise('/login');
    // $urlRouterProvider.otherwise('/list');
  }]);


})();
