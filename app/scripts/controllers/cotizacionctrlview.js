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

  var cotizaciones = [];

  self.all = function () {

    return cotizaciones;
  };

  self.setCotizaciones = function (data) {

    cotizaciones = data;

    return cotizaciones;
  };

  self.getCotizaciones = function () {

    return cotizaciones;
  };

  self.getById = function (ID) {
    var enc = false,
        i = 0;

    while (!enc) {
      if (cotizaciones[i].cotizacion.id === Number(ID)) {
        enc = true;
        return cotizaciones[i];
      }
      i++;
    }
    return null;
  };

  return self;
});

app.controller('CotizacionViewCtrl', ['$scope', '$state', 'Cotizacion', 'Cliente', 'BackendCotizacion', function ($scope, $state, Cotizacion, Cliente, BackendCotizacion) {
  var cotizaciones = [],
      clientes = [],
      muebles = [],
      contenedores = [],
      materiales = [];

  Cotizacion.all().then(function (r) {

    cotizaciones = r;
  });

  Cliente.all().then(function (r) {

    clientes = r;
  });

  Cotizacion.muebles().then(function (r) {

    muebles = r;
  });

  Cotizacion.materiales().then(function (r) {

    materiales = r;
  });

  Cotizacion.contenedores().then(function (r) {

    contenedores = r;
  });

  $scope.cotizacion_total = {

    cotizacion: {},

    cliente: {},

    muebles: [],

    materiales: [],

    contenedores: []

  };

  $scope.cotizaciones_totales = [];

  function init() {
    setTimeout(function () {

      angular.forEach(cotizaciones, function (cotizacion, key_cotizacion) {

        var cotizacion_temp = angular.copy($scope.cotizacion_total);

        cotizacion_temp.cotizacion = cotizacion;

        angular.forEach(contenedores, function (contenedor, key_contenedor) {

          if (cotizacion_temp.cotizacion.id === contenedor.cotizacion) {

            cotizacion_temp.contenedores.push(contenedor);
          }
        });

        angular.forEach(materiales, function (material, key_material) {

          if (cotizacion_temp.cotizacion.id === material.cotizacion) {

            cotizacion_temp.materiales.push(material);
          }
        });

        angular.forEach(muebles, function (mueble, key_muebles) {

          if (cotizacion_temp.cotizacion.id === mueble.cotizacion) {

            cotizacion_temp.muebles.push(mueble);
          }
        });

        angular.forEach(clientes, function (cliente, key_cliente) {

          if (cotizacion_temp.cotizacion.cliente === cliente.id) {

            cotizacion_temp.cliente = cliente;
          }
        });

        $scope.cotizaciones_totales.push(cotizacion_temp);
      });

      BackendCotizacion.setCotizaciones(angular.copy($scope.cotizaciones_totales));

      $scope.$apply();
    }, 10);
  };

  setTimeout(function () {

    init();

    $scope.$apply();
  }, 500);

  $scope.GoCotizacion = function (ID) {

    $state.go('show', { id_cotizacion: ID });
  };
}]);

app.controller('ShowCtrl', ['$scope', '$stateParams', 'BackendCotizacion', function ($scope, $stateParams, BackendCotizacion) {

  var cotizacion_total = BackendCotizacion.getById($stateParams.id_cotizacion);

  $scope.cotizacion = cotizacion_total.cotizacion;

  $scope.materiales_temp = cotizacion_total.materiales;

  $scope.contenedores_temp = cotizacion_total.contenedores;

  $scope.muebles_temp = cotizacion_total.muebles;

  $scope.cliente = cotizacion_total.cliente;

  $scope.subTotal1 = cotizacion_total.cotizacion.subtotal1;

  $scope.subTotal2 = cotizacion_total.cotizacion.subtotal2;

  console.log($scope.contenedores_temp);
}]);
