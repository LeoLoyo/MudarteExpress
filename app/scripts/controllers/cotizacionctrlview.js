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

  app.service('BackendCotizacion', ['Cotizacion', 'Contenedor', 'Mueble', 'Material', 'Cliente', '$rootScope', function (Cotizacion, Contenedor, Mueble, Material, Cliente, $rootScope) {

    var self = this;

    var cotizaciones = [],
        precio_km = [{precio:30},{precio:33},{precio:37},{precio:41}],
        cantidades = [],
        cantidades_otros = [],
        contenedores_for_delete =[],
        contenedores_temp = [],
        muebles_for_delete =[],
        muebles_temp = [],
        otros_for_delete =[],
        otros_temp = [],
        materiales = [],
        materiales_for_delete = [],
        materiales_temp = [];

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

    self.init =  function (){

      contenedores_for_delete =[];

      contenedores_temp = [];

      muebles_for_delete =[];

      muebles_temp = [];

      otros_for_delete = [];

      otros_temp = [];

      materiales = [];

      materiales_for_delete = [];

      materiales_temp = [];

    };

    self.all = function () {

      return cotizaciones;
    };

    self.setCotizaciones = function (data) {

      cotizaciones = [];

      angular.forEach(data, function(value, key){

        value.mudanza = Number(value.mudanza);

        value.soga = Number(value.soga);

        value.embalaje = Number(value.embalaje);

        value.desembalaje = Number(value.desembalaje);

        value.monto_km = Number(value.monto_km);

        value.piano_cajafuerte = Number(value.piano_cajafuerte);

        value.ajuste = Number(value.ajuste);

        value.iva = Number(value.iva);

        value.porcentaje_iva = Number(value.porcentaje_iva);

        value.precio_km = Number(value.precio_km);

        value.recorrido_km = Number(value.recorrido_km);

        value.porcentaje_margen = Number(value.porcentaje_margen);

        value.total_margen = Number(value.total_margen);

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
    self.getPrecio_km = function(){

      return precio_km;

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

        result += Number(array[i][attr]);

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

        self.CheckMaterial(contenedor_temp);

        $rootScope.$emit('change:data');
    };

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



        var out =   self.getById(ID).cotizacionmuebles;

        angular.forEach(out, function (v,k) {

          v.especificacion_id = v.especificacionid;

          v.action = 'PUT';

          v.ancho = Number(v.ancho);
          v.alto = Number(v.alto);
          v.largo = Number(v.largo);

          if(v.muebleid !== null){

            muebles_temp.push(v);

          }else{

            otros_temp.push(v);

          }

        });

      }

      return muebles_temp;


    };

    self.getMuebles_for_delete = function () {

      return muebles_for_delete;

    };

    self.findMueble = function (mueble) {

        var l = muebles_temp.length;

        for (var i = 0; i < l; i++) {

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

    self.getOtros_temp = function (){

      return otros_temp;
    };

    self.getOtros_for_delete = function () {

      return otros_for_delete;

    };

    self.findOtros = function (mueble) {

      var l = otros_temp.length;

      for (var i = 0; i < l; i++) {
        if (mueble.id === otros_temp[i].id) {

          if (mueble.cantidad > 0) {

            otros_temp[i].mueble = mueble.mueble;
            otros_temp[i].tipo_muebleid = mueble.tipo_mueble_id;
            otros_temp[i].ancho = mueble.ancho;
            otros_temp[i].largo = mueble.largo;
            otros_temp[i].alto = mueble.alto;
            otros_temp[i].cantidad = mueble.cantidad;
            otros_temp[i].descripcion = mueble.descripcion;
            otros_temp[i].total_punto = mueble.punto * mueble.cantidad;
            otros_temp[i].punto = mueble.punto;
          } else {

            if(otros_temp[i].action ===  'PUT'){

              $rootScope.$emit('change:data');

              otros_for_delete.push(otros_temp[i]);
            }

            otros_temp.splice(otros_temp.indexOf(otros_temp[i]), 1);

            }
          return true;
        }
      }

      return false;
    };

    self.deleteCampo = function(mueble) {

      for (var i = 0; i < otros_temp.length; i++) {


        if (otros_temp[i].id === mueble.id) {

          if(otros_temp[i].action ===  'PUT'){

            otros_for_delete.push(otros_temp[i]);

          }

          otros_temp.splice(otros_temp.indexOf(otros_temp[i]), 1);

        }

      }
      return true;

    };

    self.getMateriales = function (collection) {

      return Material.all().then(function (r) {
        var out = [];
        angular.forEach(r, function (v, k) {
          var m = angular.copy(v);
          m.precio = Number(m.precio);
          m.cantidad = 0;
          m.ncontenedor = 0;
          m.iscontenedor = false;
          out.push(m);
        }, out);

        angular.forEach(collection, function(mat_coti,id_key){

          angular.forEach(out,function (mat, key) {

            if(mat.id === mat_coti.materialid){

              mat.cantidad = mat_coti.cantidad;
            }

          });

        });

        materiales = out;

        return out;
      });

    };

    self.getMateriales_temp = function (ID){

      if(typeof ID !== 'undefined'){

        materiales_temp =  self.getById(ID).cotizacionmateriales;

        angular.forEach(self.getById(ID).cotizacionmateriales, function (v,k) {
          v.action = 'PUT';
        },materiales_temp);

      }

      return materiales_temp;

    };

    self.findMaterial = function(ms_tmp, m){

      var l = ms_tmp.length;

      for (var i = 0; i < l; i++) {

        if (m.material === ms_tmp[i].material) {
          if (m.cantidad > 0) {
            ms_tmp[i].cantidad = m.cantidad;
            ms_tmp[i].precio_unitario = m.precio_unitario;
            ms_tmp[i].total = m.total;
          } else {
            if (ms_tmp[i].action === 'PUT'){

              $rootScope.$emit('change_for_delete');
              materiales_for_delete.push(ms_tmp[i]);
            }

            ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]), 1);
          }

          return true;
        }
      }

      for (var i = 0; i < materiales_for_delete.length; i++) {

        if (m.material === materiales_for_delete[i].material) {

          if (m.cantidad > 0) {

            materiales_for_delete[i].cantidad = m.cantidad;

            materiales_temp.push(materiales_for_delete[i]);

            materiales_for_delete.splice(materiales_for_delete.indexOf(materiales_for_delete[i]), 1);

            $rootScope.$emit('change_for_delete');

            }

            return true;

          }

        }

        return false;
    };

    self.getMateriales_for_delete = function () {

      return materiales_for_delete;

    };

    self.AddMaterial = function (material){

      if(typeof material.cantidad === 'object'){

        var cant = angular.copy(material.cantidad.num);

      }else{

        var cant = angular.copy(material.cantidad);

      }

      var material_temp = {

        id: material.id,

        // cotizacion: 1,
        material: material.descripcion,

        cantidad: Number(cant),

        precio_unitario: Number(material.precio),

        total: Number(cant * material.precio),

        estado: "activo",

        action:'POST'

      };

      if (self.findMaterial(materiales_temp, material_temp) !== true) {

        if (Number(material_temp.cantidad) > 0) {

          materiales_temp.push(material_temp);

        }

      }
      $rootScope.$emit('change_for_delete');

    };

    self.CheckMaterial = function (contenedor){

      angular.forEach(materiales, function(v,k){

        var mat = v;

        if(Number(mat.contenedor) === Number(contenedor.contenedor)){

          setTimeout(function(){

            mat.cantidad = contenedor.cantidad;

            mat.iscontenedor = true;

            mat.ncontenedor = contenedor.cantidad;

            self.AddMaterial(mat);

            $rootScope.$apply();

          },0);

          return true;

        }

      })

    };

    self.updateCotizacion = function (cotizacionID){

      alert("guardare");
    };

    self.updateCliente = function (cliente){

      Cliente.update(cliente).then(function(r){

        if(r.status === 200){

          console.log("actulize al cliente");

        }

      });

    };

    self.updateMuebles = function (cotizacionID){

      addmueble(muebles_temp);

      addmueble(otros_temp);

      function addmueble(array){

        if(array.length > 0){

          angular.forEach(array, function(v,k){

            if(v.action === 'PUT'){

              Cotizacion.update_mueble(v).then(function(r){

                console.log("Actualizacion en el mueble : "+r.data.descripcion);

              });

            }else{

              Cotizacion.save_muebles(v,cotizacionID).then(function(r){

                console.log("Agregare el Mueble : "+r);

                v.action = 'PUT'

                return v;
              });
            }

          });
        }

      }



    };

    self.updateContenedores = function (cotizacionID){

      if(contenedores_temp.length > 0){

      angular.forEach(contenedores_temp, function(v,k){

        if(v.action === 'PUT'){

          Cotizacion.update_contenedor(v).then(function(r){

            console.log("Actualizacion en el Contenedor : "+r.data.descripcion);

          });

        }else if(v.action === 'POST'){
          Cotizacion.save_contenedores(v,cotizacionID).then(function(r){

            console.log("Agregare el Contenedor : "+r);
            v.action = 'PUT'
          });
          console.log("nuevo ");
        }

      });
    }

    };
    self.deleteContenedores = function (){

      if(contenedores_for_delete.length > 0){

        angular.forEach(contenedores_for_delete, function(v,k){

            Cotizacion.delete_contenedor(v).then(function(r){

              console.log("Eliminare el Contenedor : "+r.data.descripcion);
              contenedores_for_delete.splice(contenedores_for_delete.indexOf(v),1);

            });

        });

      }else {

        console.log("Ningun Contenedor a Eliminar");

      };

    };

    self.deleteMuebles = function (){

      _delete(muebles_for_delete);

      _delete(otros_for_delete);

      function _delete(array){

        if(array.length > 0){

          angular.forEach(array, function(v,k){

              Cotizacion.delete_mueble(v).then(function(r){

                console.log("item eliminado : "+r.data.descripcion);
                array.splice(array.indexOf(v),1);
              });

          });

        }else {

          console.log("Ningun Item a Eliminar");

        };

      }

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

  app.controller('EditCtrl',['$rootScope','$scope', '$state', '$stateParams', 'BackendCotizacion', 'tools', 'Mueble', 'Users', 'Direccion', 'Cotizacion', edit]);

  function edit($rootScope, $scope, $state, $stateParams, Backend, tools, Mueble, Users, Direccion, Cotizacion){

    var cotizacion = undefined;

    function initCotizacion() {

      Backend.init();

      $scope.cantidades = Backend.getCant();

      $scope.cant_otros = Backend.getCant_Otros();

      $scope.precios_kms = Backend.getPrecio_km();

      Mueble.tipo_mueble().then(function (muebles) {

        $scope.tipo_muebles = muebles;

      }).catch(function () {
        $scope.tipo_muebles = [];
      });


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

      Backend.getMateriales(cotizacion.cotizacionmateriales).then(function (c) {

        $scope.materiales = c;

        $scope.materiales_temp = Backend.getMateriales_temp(Number($stateParams.id_cotizacion));

        $rootScope.$emit('change_for_delete');

      });

      $rootScope.resumen = true;

      Users.all(1).then(function (r) {
        $scope.cotizadores = r;
      });
      Users.all(2).then(function (r) {
        $scope.telefonista = r;
      });
      Direccion.all().then(function (r) {
        $scope.barrio_provincias = r;
      });
      $scope.fuentes = Cotizacion.all_fuentes();

    };

    $scope.check = function (n){

      return Backend.clic_contenedor(n);

    };

    $scope.add_material = function (material) {

      Backend.AddMaterial(material);

      $scope.cotizacion.materiales = Backend.CalcularTotales($scope.materiales_temp, "total");

    };

    $scope.add_contenedor = function (contenedor, cantidad) {

      Backend.AddContenedor(contenedor, cantidad);

      $scope.metros3_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "punto") / 10;

      $scope.unidades_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "cantidad");

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
      $rootScope.$emit('change:data');

    };

    $scope.add_otros = function (campo, mueble, ancho, largo, alto, cant, descripcion) {

      if(mueble.tipo_mueble === 'Otros'){
        if (descripcion === undefined ) {
          alert('Indique la descripción');
        }else{
          var otro = {
            id: campo.id,
            mueble_id: '',
            tipo_mueble_id:mueble.id,
            mueble : mueble.tipo_mueble,
            especificacion_id:'',
            especificacion: '',
            descripcion : descripcion,
            ancho: Number(ancho),
            largo: Number(largo),
            alto: Number(alto),
            cantidad: Number(cant),
            punto: 0,
            total_punto: 0,
            estado: "activo"
          };
          var mult_dimension = otro.ancho * otro.largo * otro.alto;

          otro.punto = Math.round(otro.ancho * otro.largo * otro.alto / 100000);
          if (otro.punto === 0) {
            otro.punto = 1;
          }
          otro.total_punto = otro.punto * otro.cantidad;
          if (Backend.findOtros(otro) !== true) {
            if (otro.cantidad > 0) {
              $scope.otros_temp.push(otro);
            }
          }
        }
      }else{
        var otro = {
          id: campo.id,
          mueble_id: '',
          tipo_mueble_id:mueble.id,
          mueble : mueble.tipo_mueble,
          especificacion_id:'',
          especificacion: '',
          descripcion : descripcion,
          ancho: Number(ancho),
          largo: Number(largo),
          alto: Number(alto),
          cantidad: Number(cant),
          punto: 0,
          total_punto: 0,
          estado: "activo"
        };
        var mult_dimension = otro.ancho * otro.largo * otro.alto;
        otro.punto = Math.round(otro.ancho * otro.largo * otro.alto / 100000);
        if (otro.punto === 0) {
          otro.punto = 1;
        }
        otro.total_punto = otro.punto * otro.cantidad;
        if (Backend.findOtros(otro) !== true) {
          console.log(Backend.findOtros(otro));
          if (otro.cantidad > 0) {
            $scope.otros_temp.push(otro);
          }
        }
      }


    };

    $scope.add_campo = function () {

      $scope.otro_temp = { id: Math.floor(Math.random() * 1000 + 1) };

      $scope.otros_temp_campo.push($scope.otro_temp);

    };

    $scope.delete_campo = function (campo) {

      Backend.deleteCampo(campo);

      $scope.otros_temp_campo.splice($scope.otros_temp_campo.indexOf(campo), 1);

    };

    $scope.getIndexFromValue = function(attr,value,n) {

      var array = [];

        switch(n){
          case 1:
          array = $scope.tipo_muebles;
          break;
          case 2:
          array = $scope.cant_otros;
          break;
          case 3:
          array = $scope.precios_kms;
          value = Number(value);
          break;

        };


      for(var i=0; i<array.length; i++) {
        if(array[i][attr] === value) return i;

      }

    };

    $scope.calcular_ajuste  = function () {
      var resultado=0;
      resultado=($scope.cotizacion.ajuste/$scope.cotizacion.subtotal1)*100;
      $scope.cotizacion.porcentaje_ajuste = resultado;
      $scope.cotizacion.subtotal2 = Number($scope.cotizacion.subtotal1 + $scope.cotizacion.ajuste)
      $scope.cotizacion.total_monto = Number($scope.cotizacion.subtotal2 + $scope.cotizacion.iva)
    };

    $scope.calcular_iva  = function () {
      var resultado=0;
      resultado=Number(($scope.cotizacion.subtotal2*$scope.cotizacion.porcentaje_iva)/100);
      $scope.cotizacion.iva = resultado;
      $scope.cotizacion.total_monto = Number($scope.cotizacion.subtotal2 + $scope.cotizacion.iva)
    };

    $scope.update_presupuesto = function () {
      setTimeout(function(){
          $scope.cotizacion.subtotal1 = $scope.cotizacion.mudanza + $scope.cotizacion.soga + $scope.cotizacion.embalaje + $scope.cotizacion.desembalaje + $scope.cotizacion.materiales + $scope.cotizacion.piano_cajafuerte + $scope.cotizacion.monto_km;
          $scope.calcular_ajuste();
          $scope.calcular_iva();
          $scope.$apply();
      },0);
    };

    $scope.add_parcial1 = function () {
      $scope.cotizacion.monto_km = Number($scope.cotizacion.recorrido_km * $scope.cotizacion.precio_km);
      $scope.update_presupuesto();
    };

    initCotizacion();

    $rootScope.$on('change:data', function (){

      $scope.contenedores_for_delete = Backend.getContenedores_for_delete();

      $scope.contenedores_temp = Backend.getContenedores_temp();

      $scope.muebles_for_delete = Backend.getMuebles_for_delete();

      $scope.muebles_temp = Backend.getMuebles_temp();

      $scope.otros_for_delete = Backend.getOtros_for_delete();

      $scope.otros_temp = Backend.getOtros_temp();

      $scope.materiales_for_delete = Backend.getMateriales_for_delete();

      $scope.materiales_temp = Backend.getMateriales_temp();

      $scope.metros3_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "punto") / 10;

      $scope.unidades_contenedores = Backend.CalcularTotales($scope.contenedores_temp, "cantidad");

      $scope.metros3_muebles = Backend.CalcularTotales($scope.muebles_temp, "total_punto") / 10;

      $scope.unidades_muebles = Backend.CalcularTotales($scope.muebles_temp, "cantidad");

      $scope.cotizacion.materiales = Backend.CalcularTotales($scope.materiales_temp, "total");

      $scope.metros3_otros = Backend.CalcularTotales($scope.otros_temp, "total_punto") / 10;

      $scope.unidades_otros = Backend.CalcularTotales($scope.otros_temp, "cantidad");

      $scope.otros_temp_campo = angular.copy(Backend.getOtros_temp());

      $rootScope.total_m3 = Number( $scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros );

      $rootScope.margen = Number($scope.cotizacion.porcentaje_margen);

      $scope.$on('change_margen',function(){
        setTimeout(function(){
          $rootScope.margen = Number($scope.cotizacion.porcentaje_margen);
          $scope.$apply();
        },0)
      })

    });

    $scope.save = function () {

      Backend.updateCliente($scope.cliente);

      Backend.updateContenedores($scope.cotizacion.id);

      Backend.updateMuebles($scope.cotizacion.id);
      //
      // Backend.updatemateriales($scope.cotizacion.id);

      Backend.deleteContenedores();
      Backend.deleteMuebles();

      setTimeout(function(){
        $state.go('list');
      },1000);


    };
  };

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
