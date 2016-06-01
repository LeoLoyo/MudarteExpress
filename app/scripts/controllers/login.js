(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($rootScope, $scope, $state, Auth,setting) {
      // console.log($state.data.current.session);
      $('.btnsCotizacion').addClass('hidden');
      $rootScope.session = session;
      $scope.ingresar = function(user,pass){
        var response;
        response = Auth.valid(user);
          if(response[0].status){
            $scope.messages ='Bienvenido';

              setTimeout(function(){
                $state.go('cotizacion');
                session=true;
                $('.btnsCotizacion').removeClass('hidden');
                $('.dropdown-toggle').text('').append('<i class="glyphicon glyphicon-user"></i> '+response[0].user.name+'<span class="caret"></span>');
              },0);

          }else{
              $scope.messages ='Usuario o contraseña invalido';
              // $('.spanErrorUser').removeClass('hidden');
          }
      }
      $rootScope.logout = function(){
        // $rootScope.nav = '1';
        session=false;
        $('.dropdown-toggle').text('Login').append('<span class="caret"></span>');
        $state.go('login');
      }
    angular.element('#cUsuario').focus();
  });
})();
