(function(){
  'use strict';
  var app = angular.module('cotizacionExpressApp');
  app.controller('LoginCtrl',['$rootScope', '$scope', '$state', 'Auth','Session_resolve', 'Session', '$stateParams', function ($rootScope, $scope, $state, Auth, Session_resolve, Session, $stateParams) {

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

    $rootScope.Go = function(state,params){

        setTimeout(function(){

          if(typeof params === 'undefined'){

            $state.go(state);

          }else{

            $state.go(state, {id_cotizacion:params});

          }
          $scope.$apply();

        },500);

    };

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
