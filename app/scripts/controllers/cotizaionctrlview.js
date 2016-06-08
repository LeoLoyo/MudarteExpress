'use strict';

/**
 * @ngdoc function
 * @name cotizacionExpressApp.controller:CotizacionViewCtrl
 * @description
 * # CotizacionViewCtrl
 * Controller of the cotizacionExpressApp
 */
var app = angular.module('cotizacionExpressApp');

  app.controller('CotizacionViewCtrl', ['$scope', 'cotizaciones', 'clientes', 'muebles', 'contenedores', 'materiales', function($scope, cotizaciones, clientes, muebles, contenedores, materiales){

    $scope.cotizacion_total  = {

      cotizacion:{},

      cliente:{},

      muebles:[],

      materiales:[],

      contenedores:[]

    };

    $scope.cotizaciones_totales = [];

    function  init () {


      angular.forEach(cotizaciones,function (cotizacion,key_cotizacion) {

        var cotizacion_temp = angular.copy($scope.cotizacion_total);

        cotizacion_temp.cotizacion = cotizacion;

        angular.forEach(contenedores, function(contenedor, key_contenedor) {

          if(cotizacion_temp.cotizacion.id === contenedor.cotizacion){

            cotizacion_temp.contenedores.push(contenedor);

          }

        });

        angular.forEach(materiales, function(material, key_material) {

          if(cotizacion_temp.cotizacion.id === material.cotizacion){

            cotizacion_temp.materiales.push(material);

          }
        });

        angular.forEach(muebles, function(mueble, key_muebles) {

          if(cotizacion_temp.cotizacion.id === mueble.cotizacion){

            cotizacion_temp.muebles.push(mueble);

          }

        });

        angular.forEach(clientes, function(cliente, key_cliente) {

          if(cotizacion_temp.cotizacion.cliente === cliente.id){

            cotizacion_temp.cliente = cliente;

          }

        });


        $scope.cotizaciones_totales.push(cotizacion_temp);

      });

    };

    init();


  }])
