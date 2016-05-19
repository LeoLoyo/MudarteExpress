(function(){
  var app = angular.module('cotizacionExpressApp');
  // var app = angular.module('Express.controllers',[]);
    app.controller('CotizacionCtrl', function ($scope, Cotizacion, Contenedor, Mueble, Bulto, Cliente) {

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

        Bulto.all().then(function(bultos){
          $scope.bultos = bultos;
        });
        Cliente.all().then(function(cliente){
          $scope.cliente = cliente;
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

      $scope.contenedores_temp = [];
      $scope.muebles_temp = [];

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

      function buscar(cs_tmp,cont,attri){

        var l = cs_tmp.length;
        for(var i=0;i<cs_tmp.length;i++){
          if(cont.attri === cs_tmp[i].attri ){
            console.log(cont.unidad);
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


      $scope.add_contenedor = function(descripcion,uni) {
        var contenedor_temp = {
          contenedor:descripcion,
          unidad:uni,
          punto:0
        };
        // function buscar(cs_tmp,cont){
        //
        //   var l = cs_tmp.length;
        //   for(var i=0;i<cs_tmp.length;i++){
        //     if(cont.contenedor === cs_tmp[i].contenedor ){
        //       console.log(cont.unidad);
        //       if(cont.unidad>0){
        //           cs_tmp[i].unidad = cont.unidad;
        //       }else{
        //           cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]),1);
        //       }
        //       return true;
        //     }
        //   }
        //   return false;
        // }

        if(buscar($scope.contenedores_temp, contenedor_temp, "contenedor")!=true){
          $scope.contenedores_temp.push(contenedor_temp);
        }

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
            cantidad: uni,
            punto: 13,
            total_punto: 0,
            estado: "activo"
        };

        if(buscar($scope.muebles_temp, mueble_temp, "descripcion")!=true){
          $scope.muebles_temp.push(mueble_temp);
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
