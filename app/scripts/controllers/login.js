(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($scope, $state, Auth) {
      // console.log($state.data.current.session);
      $scope.ingresar = function(user){
          if(Auth.valid(user)){

              $state.go('cotizacion');
          }else{
              console.log("usuario invalido");
          }

      }

    angular.element('#cUsuario').focus();
  });
})();
