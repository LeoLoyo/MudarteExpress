'use strict';

/**
 * @ngdoc function
 * @name BackendCtrl.controller:CotizacionViewCtrl
 * @description
 * # CotizacionViewCtrl
 * Controller of the CotizacionViewCtrl
 */

var app = angular.module('Backend', ['Express.services']);

app.service('BackendCotizacion', function () {

  var self = this;

  var cotizaciones = [],
      cantidades = [],
      cantidades_otros = [];

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

  return self;
});

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

  }, 100);


  // $scope.GoCotizacion = function (ID) {
  //
  //   $state.go('show', { id_cotizacion: ID });
  // };
}]);

app.controller('ShowCtrl', ['$rootScope','$scope', '$state', '$stateParams', 'BackendCotizacion', function ($rootScope, $scope, $state, $stateParams, BackendCotizacion) {

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

  $scope.materiales_temp = cotizacion_total.cotizacionmateriales;

  $scope.contenedores_temp = cotizacion_total.cotizacioncontenedores;

  $scope.muebles_temp = cotizacion_total.cotizacionmuebles;

  $scope.cliente = cotizacion_total.cliente;

  $scope.unidades_muebles = calcular_totales(cotizacion_total.cotizacionmuebles, "cantidad");

  $scope.unidades_contenedores = calcular_totales(cotizacion_total.cotizacioncontenedores, "cantidad");

  $scope.metros3_contenedores = calcular_totales(cotizacion_total.cotizacioncontenedores, "punto") / 10;

  $scope.metros3_muebles = calcular_totales(cotizacion_total.cotizacionmuebles, "punto") / 10;

  $scope.subtotal1 = cotizacion_total.subtotal1;

  $scope.subtotal2 = cotizacion_total.subtotal2;

  $rootScope.Go = function(){
    $state.go('edit', {id_cotizacion:$stateParams.id_cotizacion})
  }

}]);

app.controller('EditCtrl',edit);
function edit($state, $stateParams){
  console.log($stateParams.id_cotizacion);
}
