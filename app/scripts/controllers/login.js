(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($rootScope, $scope, $state, Auth,setting) {
      // console.log($state.data.current.session);
      $('.btnsCotizacion').addClass('hidden');
      $rootScope.session = session;
      $scope.ingresar = function(user,pass){
          if(Auth.valid(user)){
            $scope.messages ='Bienvenido';

              setTimeout(function(){
                $state.go('cotizacion');
                session=true;
                $('.btnsCotizacion').removeClass('hidden');
                $('.dropdown-toggle').text(setting.user.name).append('<span class="caret"></span>');
              },1000);

          }else{
              $scope.messages ='Usuario o contraseña invalido';
              // $('.spanErrorUser').removeClass('hidden');
          }
      }
      $rootScope.logout = function(){
        session=false;
        $('.dropdown-toggle').text('Login').append('<span class="caret"></span>');
        $state.go('login');
      }
    angular.element('#cUsuario').focus();
  });
})();
