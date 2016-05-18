(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('CotizacionCtrl', function ($scope, Cotizacion, Contenedor) {

      $scope.contenedores = []
      $scope.contenedores = null;

      function init(){
        Contenedor.all().then(function(contenedores){
          // $scope.contenedores = group_by(contenedores);
          $scope.contenedores = contenedores;
        });
      };
      // function group_by(array){
      //   var group = [],l = array.length, i;
      //   for( i=0; i<l; i++) {
      //     if(flags.indexOf(array[i].contenedor) ===-1){
      //       flags.push((array[i]).contenedor);
      //     }
      //   }
      //   return group;
      // }
      init();

  });
})();
