(function(){
  var app = angular.module('cotizacionExpressApp');
  // var app = angular.module('Express.controllers',[]);
    app.controller('CotizacionCtrl', function ($scope, Cotizacion, Contenedor, Mueble, Bulto, Cliente) {

      $scope.contenedores = []
      $scope.contenedores = null;

      $scope.todoscontenedores = []
      $scope.todoscontenedores = null;
      // var contenedores_filtro = [];

      $scope.mueble = []
      $scope.mueble = null;

      // Function Recursiva
      function recur_punto(a_query,object){
        // console.log(a_query);
        var punto = 0,resta = 0,l=a_query.length;
        if(object.unidad>0){
          for(var j = 0;j<l;j++){
            if(object.unidad >= a_query[j].unidad && a_query[j].contenedor === object.contenedor){
              punto += a_query[j].punto;
              resta = object.unidad - a_query[j].unidad;
              return punto += recur_punto(a_query,resta);
            }
          }
        }
        return 0;

      };
      // fin

      $scope.contenedores_temp = [];
      $scope.muebles_temp = [];

      function cal_punto(contenedores_temp,todos) {
        var a = contenedores_temp;
        for(var i = 0;i<a.length;i++){
            a[i].punto = recur_punto(todos,a[i]);
        }
        return a;
      };

      function calcular_metro_punto(array, attr){
        var result = 0;
        angular.forEach(array,function(value,key){
            result += value.attr;
        });
        return (result/10);
      }

      function buscar_contenedor(cs_tmp,cont){

        var l = cs_tmp.length;
        for(var i=0;i<l;i++){
          if(cont.contenedor === cs_tmp[i].contenedor ){
            // console.log(cont.unidad);
            if(cont.unidad>0){
                cs_tmp[i].unidad = cont.unidad;
            }else{
                cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]),1);
            }
            return true;
          }
        }
        return false;
      }

      function buscar_mueble(ms_tmp,m){
        var l = ms_tmp.length;
        for(var i=0;i<l;i++){
          if(m.mueble === ms_tmp[i].mueble){
            // console.log(cont.unidad);
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
          unidad:uni
        };

        init(descripcion).then(function(r){

          if(buscar_contenedor($scope.contenedores_temp, contenedor_temp)!=true){
            if(contenedor_temp.unidad>0){
                $scope.contenedores_temp.push(contenedor_temp);

            }
          }
          $scope.contenedores_temp = cal_punto($scope.contenedores_temp, $scope.todoscontenedores);
          // $scope.contenedores_temp = cal_punto(array, $scope.todoscontenedores);
          // console.log(calcular_metro_punto($scope.contenedores_temp,"punto"));
          console.log($scope.contenedores_temp);
        });


      };

      $scope.add_mueble = function(mueble,uni) {
        var mueble_temp = {
            id: 1,
            cotizacion: 1,
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

      $scope.save_cotizacion = function(){

          cal_punto($scope.contenedores_temp);
      }
      angular.element('#nCotizacion').focus();

    });

    app.controller('ResumenCtrl', function ($scope) {
        $scope.contenedores = [{
                                contenedores:"Canasto",
                                cantidadesCon:"10",
                                metrosCon:"15"
                                },
                                {
                                  contenedores:"Canasto 2",
                                  cantidadesCon:"20",
                                  metrosCon:"25"
                              }];
      console.log($scope.contenedores);
    });

})();
