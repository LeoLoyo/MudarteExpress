(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($scope, $state, Auth) {
      // console.log($state.data.current.session);
      $('.btnsCotizacion').addClass('hidden');
      $scope.ingresar = function(user,pass){
          if(Auth.valid(user)){

              $state.go('cotizacion');
              $('.btnsCotizacion').removeClass('hidden');
          }else{
              console.log("usuario invalido");
              $('.spanErrorUser').removeClass('hidden');
          }
      }

    angular.element('#cUsuario').focus();
  });
})();
