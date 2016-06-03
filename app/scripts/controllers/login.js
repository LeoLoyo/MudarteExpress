(function(){
  'use strict';
  var app = angular.module('cotizacionExpressApp');
  app.controller('LoginCtrl',['$rootScope', '$scope', '$state', 'Auth','Session', function ($rootScope, $scope, $state, Auth, Session) {
    $('.btnsCotizacion').addClass('hidden');
    $rootScope.session = Session.get();
    $scope.ingresar = function (user) {
      var response;
      response = Auth.valid(user);
      if (response[0].status) {
        $scope.messages = 'Bienvenido';

        setTimeout(function () {
          $rootScope.$apply(function () {
            $state.go('cotizacion')
            $rootScope.session = Session.set(true);
            // session = true;
            // $('.btnsCotizacion').removeClass('hidden');
            angular.element('.btnsCotizacion').removeClass('hidden');
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
      $rootScope.nav = '1';
      $rootScope.session = Session.set(false);
      $('.dropdown-toggle').text('Login').append('<span class="caret"></span>');
      $state.go('login');
    };
    angular.element('#cUsuario').focus();
  }]);
})();
