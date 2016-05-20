(function(){
  var app = angular.module('cotizacionExpressApp');
  // var app = angular.module('Express.controllers',[]);
    app.controller('CotizacionCtrl', function ($scope, Cotizacion, Contenedor, Mueble, Bulto, Cliente) {
      //variables
      $scope.contenedores = []
      $scope.contenedores = null;

      $scope.todoscontenedores = []
      $scope.todoscontenedores = null;

      $scope.mueble = []
      $scope.mueble = null;

      $scope.contenedores_temp = Cotizacion.get();
      $scope.muebles_temp = [];
      $scope.metros3 = 0;
      $scope.unidades = 0;

      function recur_punto(a_query,object){
        var punto = 0,resta = 0,l=a_query.length;
        if(object.unidad>0){
          for(var j = 0;j<l;j++){
            if(object.unidad >= a_query[j].unidad){
              punto += a_query[j].punto;
              resta = object.unidad - a_query[j].unidad;
              return punto += recur_punto(a_query,resta);
            }
          }
        }
        return 0;

      };

      function cal_punto(contenedores_temp,todos) {
        for(var i = 0;i<contenedores_temp.length;i++){
          if(todos[0].contenedor===contenedores_temp[i].contenedor){
            contenedores_temp[i].punto = recur_punto(todos,contenedores_temp[i]);
          }
        }
        return contenedores_temp;
      };

      function calcular_totales(array, attr){
        var result = 0;
        for(var i = 0;i<array.length;i++){
          result += array[i][attr];
        }
        return result;
      }

      function buscar_contenedor(cs_tmp,cont){

        var l = cs_tmp.length;
        for(var i=0;i<l;i++){
          if(cont.contenedor === cs_tmp[i].contenedor ){
            if(cont.unidad>0){
                cs_tmp[i].unidad = cont.unidad;
            }else{
                cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]),1);
            }
            return true;
          }
        }
        return false;
      };

      function buscar_mueble(ms_tmp,m){
        var l = ms_tmp.length;
        for(var i=0;i<l;i++){
          if(m.mueble === ms_tmp[i].mueble){
            if(m.cantidad>0){
                ms_tmp[i].cantidad = m.cantidad;
            }else{
                ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]),1);
            }
            return true;
          }
        }
        return false;
      }

      function init(contenedor){
        if(contenedor !== undefined){
          return Contenedor.all(contenedor).then(function(contenedores){
            $scope.todoscontenedores = contenedores;

          });
        }else{
          Contenedor.all().then(function(contenedores){
            $scope.contenedores = contenedores;
          });
          Mueble.all().then(function(muebles){
            $scope.muebles = muebles;
          });

          Bulto.all().then(function(bultos){
            $scope.bultos = bultos;
          });
          Cliente.all().then(function(cliente){
            $scope.cliente = cliente;
          });

        }
      };

      init();



      $scope.add_contenedor = function(descripcion,uni) {
        var contenedor_temp = {
          contenedor:descripcion,
          unidad:uni,
          punto : 0
        };

        init(descripcion).then(function(r){

        if(!buscar_contenedor($scope.contenedores_temp, contenedor_temp)){
            if(contenedor_temp.unidad>0){
              $scope.contenedores_temp.push(contenedor_temp);
            }
        }
        $scope.contenedores_temp = cal_punto($scope.contenedores_temp, $scope.todoscontenedores);
        $scope.metros3 = calcular_totales($scope.contenedores_temp,"punto")/10;
        $scope.unidades = calcular_totales($scope.contenedores_temp,"unidad");
        Cotizacion.save_contenedores($scope.contenedores_temp);
        });
      };

      $scope.add_mueble = function(mueble,uni) {
        var mueble_temp = {
            // id: 1,
            // cotizacion: 1,
            mueble: mueble.descripcion,
            descripcion: "",
            ancho: Number(mueble.ancho),
            largo: Number(mueble.largo),
            alto: Number(mueble.alto),
            cantidad: Number(uni),
            punto: Number(mueble.punto),
            total_punto: Number(uni*mueble.punto),
            estado: "activo"
        };

        if(buscar_mueble($scope.muebles_temp, mueble_temp)!=true){
          if(mueble_temp.cantidad >0){
              $scope.muebles_temp.push(mueble_temp);
          }
        }
        console.log($scope.muebles_temp);
      };

      $scope.add_otros = function(mueble){
        var otro_temp = {
            // id: 1,
            // cotizacion: 1,
            mueble: mueble.descripcion,
            descripcion: "",
            ancho: Number(mueble.ancho),
            largo: Number(mueble.largo),
            alto: Number(mueble.alto),
            cantidad: Number(uni),
            punto: Number(mueble.punto),
            total_punto: Number(uni*mueble.punto),
            estado: "activo"
        };

      }
      $scope.save_cotizacion = function(){

          cal_punto($scope.contenedores_temp);
      }
      angular.element('#nCotizacion').focus();

    });

})();
