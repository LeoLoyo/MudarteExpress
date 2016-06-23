'use strict';

/**
 * @ngdoc function
 * @name BackendCtrl.controller:CotizacionViewCtrl
 * @description
 * # CotizacionViewCtrl
 * Controller of the CotizacionViewCtrl
 */

var app = angular.module('Backend', ['Express.services']);

app.service('tools',function(){

  var self = this;

  self.scope_time = function (time){

    var str = angular.copy(time);

    var res = str.split(":",2);

    var d = new Date(1,1,1,res[0],res[1]);

    return d;

  };

  return self;
})

app.service('BackendCotizacion', ['Contenedor', 'Mueble', 'Material', '$rootScope', function (Contenedor, Mueble, Material, $rootScope) {

  var self = this;

  var cotizaciones = [],
      cantidades = [],
      cantidades_otros = [],
      contenedores_for_delete =[],
      contenedores_temp = [],
      muebles_for_delete =[],
      muebles_temp = [];

  function recur_punto(a_query, object) {
    var punto = 0,
        resta = angular.copy(object),
        l = a_query.length;
    if (Number(object.cantidad) > 0) {
      for (var j = 0; j < l; j++) {
        if (Number(object.cantidad) >= Number(a_query[j].cantidad)) {
          punto += a_query[j].punto;
          resta.cantidad = Number(object.cantidad) - Number(a_query[j].cantidad);
          return punto += recur_punto(a_query, resta);
        }
      }
    }
    return Number(punto);
  };

  self.all = function () {

    return cotizaciones;
  };

  self.setCotizaciones = function (data) {

    cotizaciones = [];

    angular.forEach(data, function(value, key){

      (value.seguro)? value.seguro = 'Si': value.seguro='No';

      (value.desarme_mueble)? value.desarme_mueble = 'Si':value.desarme_mueble='No';

      (value.rampa)? value.rampa = 'Si':value.rampa='No';

      value.numero_ayudante = {num:value.numero_ayudante};

      value.ambiente = {num:value.ambiente};

      cotizaciones.push(value);

    },cotizaciones);

    return cotizaciones;
  };

  self.getCotizaciones = function () {

    return cotizaciones;
  };

  self.getById = function (ID) {

    var enc = false,
        i = 0;

    while (!enc) {

      if (cotizaciones[i].id === Number(ID)) {
        enc = true;
        return cotizaciones[i];
      }
      i++;
    }
    return null;
  };

  self.LoadCant = function () {
    var res = [];

    cantidades = [];

    for (var i = 0; i < 100; i++) {

      var cant = { num: i, cantidad: i };

      cantidades.push(cant);

    }

    for (var i = 30; i < 300; i+=10) {

      var cant = { num: i, cantidad: i };

      cantidades_otros.push(cant);

    }

    res.push(cantidades);

    res.push(cantidades_otros);

    return true;

  };

  self.getCant = function () {

    return cantidades;

  };

  self.getCant_Otros = function () {

    return cantidades_otros;

  };

  self.getContenedores = function (collection) {

    return Contenedor.all().then(function (contenedores) {

      var out = [];

      angular.forEach(contenedores, function (v, k) {
        var m = angular.copy(v);
        m.cantidad = 0;
        out.push(m);
      }, out);

      angular.forEach(collection, function(cont_coti,id_key){

        angular.forEach(out,function (cont, key) {

          if(cont.id === cont_coti.contenedor){

            cont.cantidad = cont_coti.cantidad;
          }

        });

      });

      return out;

    });

  };

  self.getContenedores_temp = function (ID){

    if(typeof ID !== 'undefined'){

      contenedores_temp =  self.getById(ID).cotizacioncontenedores;

      angular.forEach(contenedores_temp, function (v,k) {
        v.action = 'PUT';
      },contenedores_temp);

    }

    return contenedores_temp;

  };

  self.findContenedor = function(cs_tmp, cont){

      var l = cs_tmp.length;

      for (var i = 0; i < l; i++) {
        if (cont.contenedor === cs_tmp[i].contenedor) {
          if (cont.cantidad > 0) {
            cs_tmp[i].cantidad = cont.cantidad;
          } else {
            if (cs_tmp[i].action === 'PUT'){

              $rootScope.$emit('change:data');

              contenedores_for_delete.push(cs_tmp[i]);

            }
            cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]), 1);

          }
          return true;
        }
      }

      for (var i = 0; i < contenedores_for_delete.length; i++) {
        if (cont.contenedor === contenedores_for_delete[i].contenedor) {
          if (cont.cantidad > 0) {

            contenedores_for_delete[i].cantidad = cont.cantidad;

            contenedores_temp.push(contenedores_for_delete[i]);

            contenedores_for_delete.splice(contenedores_for_delete.indexOf(contenedores_for_delete[i]), 1);

            $rootScope.$emit('change:data');

          }

          return true;

        }

      }

      return false;
    };

  self.getContenedores_for_delete = function () {

    return contenedores_for_delete;

  };

  self.clic_contenedor = function (n) {

    n = Number(n) + 1;

    return n;

  };

  self.CalPunto = function (todos){

    todos.reverse();

    for (var i = 0; i < contenedores_temp.length; i++) {

      if (todos[0].contenedor === contenedores_temp[i].contenedor) {

        contenedores_temp[i].punto = recur_punto(todos, contenedores_temp[i]);

      }

    }

    $rootScope.$emit('change:data');

    return contenedores_temp;

  };

  self.CalcularTotales = function (array, attr) {

    var result = 0;

    for (var i = 0; i < array.length; i++) {

      result += array[i][attr];

    }

    return result;


  };

  self.AddContenedor = function (contenedor, cantidad){

    var contenedor_temp = {

      descripcion: contenedor.contenedor,

      contenedor: contenedor.id,

      cantidad: Number(cantidad),

      punto: 0,

      action:'POST'

    };

      if (!self.findContenedor(contenedores_temp, contenedor_temp)) {

        if (Number(contenedor_temp.cantidad) > 0) {

          contenedores_temp.push(contenedor_temp);

        }

      }

      self.CalPunto(contenedor.detallecontenedores);

      $rootScope.$emit('change:data');
  }

  self.getMuebles = function(collection){

    return Mueble.all().then(function (muebles) {
      var out = [];

      angular.forEach(muebles, function (v, k) {

        var m = angular.copy(v);

        angular.forEach(m.especificacionmuebles, function (v1,k1 ){

          v1.cantidad = 0;

        });

        out.push(m);

      }, out);



      angular.forEach(collection, function(v,id_key){

        angular.forEach(out,function (obj, key) {

          if(obj.id === v.muebleid){

            angular.forEach(obj.especificacionmuebles,function (esp, key_esp) {

              if(esp.id === v.especificacionid){

                esp.cantidad = v.cantidad;

              }

            });

          }

        });

      },out);

      return out;

    });

  };

  self.getMuebles_temp = function (ID){

    if(typeof ID !== 'undefined'){

      muebles_temp =  self.getById(ID).cotizacionmuebles;

      angular.forEach(muebles_temp, function (v,k) {

        v.action = 'PUT';

      },muebles_temp);

    }

    return muebles_temp;

  };

  return self;

}]);

// app.controller('CotizacionViewCtrl', ['$scope', '$state', 'Cotizacion', 'Cliente', 'Users', 'BackendCotizacion', function ($scope, $state, Cotizacion, Cliente, Users, BackendCotizacion) {
app.controller('CotizacionViewCtrl', ['$scope', '$state', 'Cotizacion', 'BackendCotizacion', function ($scope, $state, Cotizacion, BackendCotizacion) {

  // var cotizaciones = [],
  //     clientes = [],
  //     muebles = [],
  //     contenedores = [],
  //     materiales = [],
  //     cotizadores = [];
  //
  // Users.all(1).then(function (r) {
  //
  //   cotizadores = r;
  // });


  // Cotizacion.all().then(function (r) {

    // cotizaciones = r;

  // });

  // Cliente.all().then(function (r) {
  //
  //   clientes = r;
  // });
  //
  // Cotizacion.muebles().then(function (r) {
  //
  //   muebles = r;
  // });
  //
  // Cotizacion.materiales().then(function (r) {
  //
  //   materiales = r;
  // });
  //
  // Cotizacion.contenedores().then(function (r) {
  //
  //   contenedores = r;
  // });
  //
  // $scope.cotizacion_total = {
  //
  //   cotizacion: {},
  //
  //   cliente: {},
  //
  //   muebles: [],
  //
  //   materiales: [],
  //
  //   contenedores: []
  //
  // };

  // $scope.cotizaciones_totales = [];

  // function init() {
  //   setTimeout(function () {
  //
  //     angular.forEach(cotizaciones, function (cotizacion, key_cotizacion) {
  //
  //       var cotizacion_temp = angular.copy($scope.cotizacion_total);
  //
  //       cotizacion_temp.cotizacion = cotizacion;
  //
  //       (cotizacion_temp.cotizacion.seguro)?cotizacion_temp.cotizacion.seguro = 'Si':cotizacion_temp.cotizacion.seguro='No';
  //
  //       (cotizacion_temp.cotizacion.desarme_mueble)?cotizacion_temp.cotizacion.desarme_mueble = 'Si':cotizacion_temp.cotizacion.desarme_mueble='No';
  //
  //       (cotizacion_temp.cotizacion.rampa)?cotizacion_temp.cotizacion.rampa = 'Si':cotizacion_temp.cotizacion.rampa='No';
  //
  //       cotizacion_temp.cotizacion.numero_ayudante = {num:cotizacion_temp.cotizacion.numero_ayudante};
  //
  //       cotizacion_temp.cotizacion.ambiente = {num:cotizacion_temp.cotizacion.ambiente};
  //
  //       angular.forEach(cotizadores, function (cotizador, key_cotizador) {
  //
  //         if (cotizacion_temp.cotizacion.cotizador === cotizador.id) {
  //
  //           cotizacion_temp.cotizacion.cotizador = cotizador;
  //         }
  //       });
  //
  //       angular.forEach(contenedores, function (contenedor, key_contenedor) {
  //
  //         if (cotizacion_temp.cotizacion.id === contenedor.cotizacion) {
  //
  //           cotizacion_temp.contenedores.push(contenedor);
  //         }
  //       });
  //
  //       angular.forEach(materiales, function (material, key_material) {
  //
  //         if (cotizacion_temp.cotizacion.id === material.cotizacion) {
  //
  //           cotizacion_temp.materiales.push(material);
  //         }
  //       });
  //
  //       angular.forEach(muebles, function (mueble, key_muebles) {
  //
  //         if (cotizacion_temp.cotizacion.id === mueble.cotizacion) {
  //
  //           cotizacion_temp.muebles.push(mueble);
  //         }
  //       });
  //
  //       angular.forEach(clientes, function (cliente, key_cliente) {
  //
  //         if (cotizacion_temp.cotizacion.cliente === cliente.id) {
  //
  //           cotizacion_temp.cliente = cliente;
  //         }
  //       });
  //
  //       $scope.cotizaciones_totales.push(cotizacion_temp);
  //     });
  //
  //     BackendCotizacion.setCotizaciones(angular.copy($scope.cotizaciones_totales));
  //
  //     $scope.$apply();
  //   }, 10);
  // };

  // setTimeout(function () {
  //
  //   init();
  //
  //   $scope.$apply();
  // }, 500);

  // $scope.cotizaciones_totales = [];

  setTimeout(function () {


    Cotizacion.all().then(function (r) {

      $scope.cotizaciones_totales = r;

      BackendCotizacion.LoadCant();

      BackendCotizacion.setCotizaciones(angular.copy($scope.cotizaciones_totales));

    });

    $scope.$apply();

  }, 0);


  // $scope.GoCotizacion = function (ID) {
  //
  //   $state.go('show', { id_cotizacion: ID });
  // };
}]);

app.controller('ShowCtrl', ['$scope', '$state', '$stateParams', 'BackendCotizacion', '$rootScope', function ($scope, $state, $stateParams, BackendCotizacion, $rootScope) {

  function calcular_totales(array, attr) {
    var result = 0;
    for (var i = 0; i < array.length; i++) {
      result += array[i][attr];
    }
    return result;
  }

  var cotizacion_total = BackendCotizacion.getById(Number($stateParams.id_cotizacion));

  // $scope.cotizacion = cotizacion_total.cotizacion;
  //
  // $scope.materiales_temp = cotizacion_total.materiales;
  //
  // $scope.contenedores_temp = cotizacion_total.contenedores;
  //
  // $scope.muebles_temp = cotizacion_total.muebles;
  //
  // $scope.cliente = cotizacion_total.cliente;
  //
  // $scope.metros3_contenedores = calcular_totales(cotizacion_total.contenedores, "punto") / 10;
  //
  // $scope.metros3_muebles = calcular_totales(cotizacion_total.muebles, "punto") / 10;
  //
  // $scope.subtotal1 = cotizacion_total.cotizacion.subtotal1;
  //
  // $scope.subtotal2 = cotizacion_total.cotizacion.subtotal2;

  $scope.cotizacion = cotizacion_total;

  $rootScope.id_cotizacion = angular.copy(cotizacion_total.id);

  $scope.materiales_temp = cotizacion_total.cotizacionmateriales;

  $scope.contenedores_temp = cotizacion_total.cotizacioncontenedores;

  $scope.muebles_temp = cotizacion_total.cotizacionmuebles;

  $scope.cliente = cotizacion_total.cliente;

  $scope.unidades_muebles = calcular_totales(cotizacion_total.cotizacionmuebles, "cantidad");

  $scope.unidades_contenedores = calcular_totales(cotizacion_total.cotizacioncontenedores, "cantidad");

  $scope.metros3_contenedores = calcular_totales(cotizacion_total.cotizacioncontenedores, "punto") / 10;

  $scope.metros3_muebles = calcular_totales(cotizacion_total.cotizacionmuebles, "total_punto") / 10;

  $scope.subtotal1 = cotizacion_total.subtotal1;

  $scope.subtotal2 = cotizacion_total.subtotal2;

}]);

app.controller('EditCtrl',['$rootScope','$scope', '$state', '$stateParams', 'BackendCotizacion', 'tools', 'Contenedor', edit]);

function edit($rootScope, $scope, $state, $stateParams, Backend, tools, Contenedor){

  $scope.contenedores_for_delete = [];

  $scope.materiales_for_delete = [];

  $scope.muebles_for_delete = [];

  $rootScope.$on('change:data', function (){

    $scope.contenedores_for_delete = Backend.getContenedores_for_delete();

    $scope.contenedores_temp = Backend.getContenedores_temp();

    // $scope.materiales_temp = Backend.getMateriales_temp();

    $scope.muebles_temp = Backend.getMuebles_temp();

    $scope.metros3_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "punto") / 10;

    $scope.unidades_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "cantidad");

  });

  $scope.cotizacion = undefined;


  function initCotizacion(){

    $scope.cantidades = Backend.getCant();


    var cotizacion = Backend.getById(Number($stateParams.id_cotizacion));

    cotizacion.fecha_estimada_mudanza = new Date(cotizacion.fecha_estimada_mudanza);

    cotizacion.hora_estimada_mudanza = tools.scope_time(cotizacion.hora_estimada_mudanza);

    cotizacion.fecha_de_cotizacion = new Date(cotizacion.fecha_de_cotizacion);

    cotizacion.hora_de_cotizacion = tools.scope_time(cotizacion.hora_de_cotizacion);

    //carga inicial

    Backend.getContenedores(cotizacion.cotizacioncontenedores).then(function (c) {

      $scope.contenedores = c;

      $scope.contenedores_temp = Backend.getContenedores_temp(Number($stateParams.id_cotizacion));

      $rootScope.$emit('change:data');


    });

    Backend.getMuebles(cotizacion.cotizacionmuebles).then(function (response) {
console.log(response);
      $scope.muebles = response;

      $scope.muebles_temp = Backend.getMuebles_temp(Number($stateParams.id_cotizacion));

      $rootScope.$emit('change:data');


    });



    $scope.check = function (n){

      return Backend.clic_contenedor(n);

    };

    $scope.add_contenedor = function (contenedor, cantidad) {

      Backend.AddContenedor(contenedor, cantidad);

      $scope.metros3_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "punto") / 10;

      $scope.unidades_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "cantidad");

        // check_material(contenedor_temp);
        // $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);
        // $scope.update_presupuesto();
      // });
    };

    setTimeout(function(){

      $scope.cotizacion = cotizacion;

      $scope.cliente = cotizacion.cliente;

      $scope.$apply();
    },0)

  };

  initCotizacion();




}
