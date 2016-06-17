(function(){
  'use strict';
  var app = angular.module('cotizacionExpressApp');
  app.controller('LoginCtrl',['$rootScope', '$scope', '$state', 'Auth','Session_resolve', 'Session', function ($rootScope, $scope, $state, Auth, Session_resolve, Session) {

    $rootScope.session = Session_resolve;

    $scope.ingresar = function (user) {

      var response = Auth.valid(user);

      if (response[0].status) {

        $scope.messages = 'Bienvenido';

        $state.go('list');

        Session.set(true);

      } else {

        $scope.messages = 'Usuario o contraseña invalido';
      }

    };

    $rootScope.Go = function(state){

      $state.go(state);

    }

    // $rootScope.logout = function () {
    //   $('.cargando').removeClass('hidden');
    //   $rootScope.nav = '1';
    //   Session.set(false);
    //   $('.dropdown-toggle').text('Login').append('<span class="caret"></span>');
    //   $state.go('login');
    // };

    angular.element('#cUsuario').focus();
  }]);
})();
