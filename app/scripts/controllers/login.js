(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($scope, $state, Auth) {
      // console.log($state.data.current.session);
      $('.btnsCotizacion').addClass('hidden');
      $scope.ingresar = function(user,pass){
          if(Auth.valid(user)){
            $scope.messages ='Bienvenido';

              setTimeout(function(){
                $state.go('cotizacion');
                session=true;
                $('.btnsCotizacion').removeClass('hidden');
                $('.dropdown-toggle').text(user.name).append('<span class="caret"></span>');
              },1000);

          }else{
              $scope.messages ='Usuario invalido';
              // $('.spanErrorUser').removeClass('hidden');
          }
      }
      $scope.logout = function(){
        alert("asdasd");
        session=false;
        $state.go('login');
      }
    angular.element('#cUsuario').focus();
  });
})();
