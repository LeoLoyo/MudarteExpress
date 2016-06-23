(function(){
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

          v.especificacion_id = v.especificacionid;

          v.action = 'PUT';

        },muebles_temp);

      }

      return muebles_temp;

    };

    self.getMuebles_for_delete = function () {

      return muebles_for_delete;

    };

    self.findMueble = function (mueble) {

        var l = muebles_temp.length;

        for (var i = 0; i < l; i++) {
          console.log(mueble);
          console.log(muebles_temp[i]);
          if (mueble.especificacion_id === muebles_temp[i].especificacion_id) {

            if (mueble.cantidad > 0) {

              muebles_temp[i].cantidad = mueble.cantidad;

              muebles_temp[i].total_punto = mueble.total_punto;

            } else {

              if (muebles_temp[i].action === 'PUT'){

                $rootScope.$emit('change:data');

                muebles_for_delete.push(muebles_temp[i]);

              }

              muebles_temp.splice(muebles_temp.indexOf(muebles_temp[i]), 1);

            }

            return true;

          }

        }

        for (var i = 0; i < muebles_for_delete.length; i++) {

          if (mueble.especificacion_id === muebles_for_delete[i].especificacion_id) {

            if (mueble.cantidad > 0) {

              muebles_for_delete[i].cantidad = mueble.cantidad;

              muebles_for_delete[i].total_punto = mueble.total_punto;

              muebles_temp.push(muebles_for_delete[i]);

              muebles_for_delete.splice(muebles_for_delete.indexOf(muebles_for_delete[i]), 1);

              $rootScope.$emit('change:data');

            }

            return true;

          }

        }

        return false;

      };

    return self;

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

  app.controller('EditCtrl',['$rootScope','$scope', '$state', '$stateParams', 'BackendCotizacion', 'tools', edit]);

  function edit($rootScope, $scope, $state, $stateParams, Backend, tools){

    var cotizacion = undefined;

    function initCotizacion(){

      $scope.cantidades = Backend.getCant();

      cotizacion = Backend.getById(Number($stateParams.id_cotizacion));

      cotizacion.fecha_estimada_mudanza = new Date(cotizacion.fecha_estimada_mudanza);

      cotizacion.hora_estimada_mudanza = tools.scope_time(cotizacion.hora_estimada_mudanza);

      cotizacion.fecha_de_cotizacion = new Date(cotizacion.fecha_de_cotizacion);

      cotizacion.hora_de_cotizacion = tools.scope_time(cotizacion.hora_de_cotizacion);

      $scope.cotizacion = cotizacion;

      $scope.cliente = cotizacion.cliente;

      Backend.getContenedores(cotizacion.cotizacioncontenedores).then(function (c) {

        $scope.contenedores = c;

        $scope.contenedores_temp = Backend.getContenedores_temp(Number($stateParams.id_cotizacion));

        $rootScope.$emit('change:data');


      });

      Backend.getMuebles(cotizacion.cotizacionmuebles).then(function (response) {

        $scope.muebles = response;

        $scope.muebles_temp = Backend.getMuebles_temp(Number($stateParams.id_cotizacion));

        $rootScope.$emit('change:data');


      });

      $rootScope.resumen = true;

    };

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
    };

    $scope.add_mueble = function (especificacion, uni,mueble) {

      var mueble_temp = {

        mueble_id:mueble.id,

        tipo_mueble_id:'',

        mueble: mueble.descripcion,

        especificacion_id:especificacion.id,

        especificacion: especificacion.especificacion,

        descripcion: "",

        ancho: Number(especificacion.ancho),

        largo: Number(especificacion.largo),

        alto: Number(especificacion.alto),

        cantidad: Number(uni),

        punto: Number(especificacion.punto),

        total_punto: Number(Number(uni) * Number(especificacion.punto)),

        estado: "activo",

        action:'POST'

      };

      if (Backend.findMueble(mueble_temp) !== true) {

        if (Number(mueble_temp.cantidad) > 0) {

          $scope.muebles_temp.push(mueble_temp);

        }

      }
      // $scope.metros3_muebles = calcular_totales($scope.muebles_temp, "total_punto") / 10;
      // $scope.unidades_muebles = calcular_totales($scope.muebles_temp, "cantidad");
      // $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);
    };

    initCotizacion();

    $rootScope.$on('change:data', function (){

      $scope.contenedores_for_delete = Backend.getContenedores_for_delete();

      $scope.contenedores_temp = Backend.getContenedores_temp();

      $scope.muebles_for_delete = Backend.getMuebles_for_delete();

      $scope.muebles_temp = Backend.getMuebles_temp();

      $scope.metros3_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "punto") / 10;

      $scope.unidades_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "cantidad");

    });

  }

  app.controller('CotizacionViewCtrl', function ($scope, $state, Cotizacion, BackendCotizacion) {

    setTimeout(function () {

      Cotizacion.all().then(function (r) {

        $scope.cotizaciones_totales = r;

        BackendCotizacion.LoadCant();

        BackendCotizacion.setCotizaciones(angular.copy($scope.cotizaciones_totales));

      });

      $scope.$apply();

    }, 0);
  });

})();
