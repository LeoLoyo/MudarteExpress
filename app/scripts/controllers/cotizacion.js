(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('CotizacionCtrl', function ($scope, Cotizacion, Contenedor, Mueble) {

      $scope.contenedores = []
      $scope.contenedores = null;
      $scope.mueble = []
      $scope.mueble = null;

      function init(){
        Contenedor.all().then(function(contenedores){
          $scope.contenedores = contenedores;
        });

        Mueble.all().then(function(muebles){
          $scope.muebles = muebles;
        });
      };

      init();

      // Function Recursiva
      function recur_punto(a_query,cant_rest){
        var punto = 0,resta = 0,l=a_query.length;
        if(cant_rest>0){
          for(var j = 0;j<l;j++){
            if(cant_rest >= a_query[j].unidad){
              punto += a_query[j].punto;
              resta = cant_rest - a_query[j].unidad;
              return punto += recur_punto(a_query,resta);
            }
          }
        }
        return 0;

      };
    // fin

      $scope.contenedores_temp = [{contenedor:"Canasto",unidad:11,punto:0}];

      function cal_punto(contenedores) {
        var a = contenedores;
        for(var i = 0;i<a.length;i++){
          var query = [];
          var query = null;
          Contenedor.all(a[i].contenedor).then(function(contenedores){
            query = contenedores;
          });
          a[i].punto = recur_punto(query,a[i].unidad);
        }
      };



      $scope.add_contenedor = function(descripcion,unidad) {
        var contenedor_temp = {
          contenedor:descripcion,
          unidad:unidad,
          punto:0
        };
        function buscar(){
          for(var i=0;i<$scope.contenedores_temp.length;i++){
            if(descripcion === $scope.contenedores_temp[i].contenedor ){
              if(unidad>0){
                  $scope.contenedores_temp[i].unidad = unidad;
              }else{
                  $scope.contenedores_temp.splice($scope.contenedores_temp.indexOf($scope.contenedores_temp[i]),1);
              }
              return true;
            }
          }
          return false;
        }
        if(buscar!=true){
          $scope.contenedores_temp.push(contenedor_temp);
        }
        console.log(contenedor_temp);

      };

      $scope.add_mueble = function() {
      };

      $scope.save_cotizacion = function(){

          cal_punto($scope.contenedores_temp);
      }

  });
})();
