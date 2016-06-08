(function(){
  'use strict';
  var app = angular.module('cotizacionExpressApp');
  app.controller('LoginCtrl',['$rootScope', '$scope', '$state', 'Auth','Session_resolve', 'Session', function ($rootScope, $scope, $state, Auth, Session_resolve, Session) {

    $rootScope.session = Session_resolve;

    $('.btnsCotizacion').addClass('hidden');
    angular.element('.cargando').addClass('hidden');

    // $rootScope.session = Session.get();

    $scope.ingresar = function (user) {
      var response;
      response = Auth.valid(user);
      if (response[0].status) {
        $scope.messages = 'Bienvenido';

        setTimeout(function () {
          $rootScope.$apply(function () {
            $state.go('cotizacion')
            Session.set(true);
            // $('.btnsCotizacion').removeClass('hidden');
            angular.element('.btnsCotizacion').removeClass('hidden');
            angular.element('.cargando').removeClass('hidden');
            angular.element('.dropdown-toggle').text('').append('<i class="glyphicon glyphicon-user"></i> ' + response[0].user.name + '<span class="caret"></span>');
            // $('.dropdown-toggle').text('').append('<i class="glyphicon glyphicon-user"></i> ' + response[0].user.name + '<span class="caret"></span>');
          });
        }, 500);
      } else {
        $scope.messages = 'Usuario o contraseña invalido';
        // $('.spanErrorUser').removeClass('hidden');
      }
    };

    $rootScope.logout = function () {
      $('.cargando').removeClass('hidden');
      $rootScope.nav = '1';
      Session.set(false);
      $('.dropdown-toggle').text('Login').append('<span class="caret"></span>');
      $state.go('login');
    };
    angular.element('#cUsuario').focus();
  }]);
})();
