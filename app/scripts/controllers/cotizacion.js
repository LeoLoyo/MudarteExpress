(function () {
  'use strict';

  var app = angular.module('cotizacionExpressApp');

  app.controller('CotizacionCtrl', [
    'Session',
    '$interval',
    '$rootScope',
    '$state',
    '$scope',
    'Users',
    'Direccion',
    'Cotizacion',
    'Contenedor',
    'Mueble',
    'Material',
    'Bulto',
    'Cliente',
    'setting', 'BackendCotizacion',function (Session, $interval, $rootScope, $state, $scope, Users, Direccion, Cotizacion, Contenedor, Mueble, Material, Bulto, Cliente, setting, BackendCotizacion) {

      var select = function () {


         setTimeout(function(){
          //  $('select.selectPicker').selectpicker();
           $('select.selectPicker').selectpicker('destroy');
          //  $('select.selectPicker').selectpicker('destroy');
           $('select.selectPicker').selectpicker();
           $scope.$apply();
         },400);

      }

      $rootScope.session = Session.set(true);
      $scope.limpiarM = true;
      angular.element('#ncotizacion').focus();
      // variables
      $interval(function handleInterval() {
        $rootScope.$broadcast("change");
      }, 0);

      $('.btnsCotizacion').removeClass('hidden');

      $scope.cantidades = angular.copy(BackendCotizacion.getCant());

      $scope.cant_otros = angular.copy(BackendCotizacion.getCant_Otros());

      // function numeros_otros() {
      //   for (var i = 30; i < 300; i+=10) {
      //     var cant = { num: i, cantidad: i };
      //     $scope.cant_otros.push(cant);
      //   }
      //   // return $scope.cant_otros;
      // }

      //objecto cliente
      $scope.cliente = {
        nombre: '',
        telefono: '',
        email: '',
        direccion: ''
      };



      // objecto direccion

      var cotizacion = {
        numero_cotizacion: '',
        cliente: '',
        cotizador: '',
        quien_llamo: '',
        quien_cotizo: '',
        fuente: '',
        cp_pv: '',
        tipo_cliente: 'Particular',
        cargo: '',
        forma_pago: '',
        fecha_de_carga: new Date(),
        hora_de_carga: new Date(),
        fecha_estimada_mudanza: '',
        hora_estimada_mudanza: '',
        fecha_de_cotizacion: new Date(),
        hora_de_cotizacion: new Date(),
        fecha_de_aviso:new Date(),
        hora_de_aviso: '',
        fecha_de_cierre:'',
        hora_de_cierre: '',
        fecha_real_mudanza: '',
        hora_real_mudanza: '',
        direccion_origen: '',
        barrio_provincia_origen: '',
        observacion_origen: '',
        direccion_destino: '',
        barrio_provincia_destino: '',
        observacion_destino: '',
        recorrido_km: Number(0),
        precio_km: Number(30),
        monto_km: Number(0),
        tiempo_de_carga: Number(0),
        tiempo_de_descarga: Number(0),
        numero_camion: Number(0),
        numero_ayudante: {num:'0'},
        seguro: 'No',
        desarme_mueble: 'No',
        ambiente: {num:'0'},
        rampa: 'No',
        mudanza: Number(0),
        soga: Number(0),
        embalaje: Number(0),
        desembalaje: Number(0),
        materiales: Number(0),
        piano_cajafuerte: Number(0),
        subtotal1:Number(0),
        porcentaje_ajuste: Number(0),
        subtotal2: Number(0),
        porcentaje_iva: Number(0),
        ajuste: Number(0),
        iva: Number(0),
        total_monto: Number(0),
        observacion: '',
        total_cantidad: 0,
        total_m3: '0.00',
        porcentaje_margen: Number(25),
        total_margen: '0.00',
        estado: 'activo'
      };

      $scope.cotizacion = angular.copy(cotizacion);

      // $scope.cotizadores = [];
      // $scope.cotizadores = null;
      //
      // $scope.telefonistas = [];
      // $scope.telefonistas = null;
      //
      // $scope.contenedores = [];
      // $scope.contenedores = null;
      //
      // $scope.todoscontenedores = [];
      // $scope.todoscontenedores = null;
      //
      // $scope.tipo_muebles = [];
      // $scope.tipo_muebles = null;

      // $scope.barrio_provincias = [];
      // $scope.barrio_provincias = null;


      $scope.contenedores_temp = [];
      $scope.muebles_temp = [];

      $scope.otros_temp = [];
      $scope.otros_temp_campo = [];

      //Variables De Totales
      $scope.metros3_contenedores = 0;
      $scope.unidades_contenedores = 0;

      $scope.metros3_muebles = 0;
      $scope.unidades_muebles = 0;

      $scope.metros3_otros = 0;
      $scope.unidades_otros = 0;

      function fecha_format(f){
          f = new Date(f);
          var fecha = ""+f.getFullYear()+ "-" + (f.getMonth() +1) + "-" + f.getDate()+"";
          return fecha;
        }
        function hora_format(f){
              f = new Date(f);
              var hora = f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
              return hora;
        }

      function buscar_punto(mult_dimension, bultos) {
        for (var i = 0; i < bultos.length; i++) {
          if (bultos[i].ancho * bultos[i].largo * bultos[i].alto === mult_dimension) {
            return bultos[i].punto;
          }
        }
        return 0;
      }

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

      function cal_punto(contenedores_temp, todos) {
        for (var i = 0; i < contenedores_temp.length; i++) {
          if (todos[0].contenedor === contenedores_temp[i].contenedor) {
            contenedores_temp[i].punto = recur_punto(todos, contenedores_temp[i]);
          }
        }
        return contenedores_temp;
      };

      function calcular_totales(array, attr) {
        var result = 0;
        for (var i = 0; i < array.length; i++) {
          result += array[i][attr];
        }
        return result;
      }

      function buscar_contenedor(cs_tmp, cont) {

        var l = cs_tmp.length;
        for (var i = 0; i < l; i++) {
          if (cont.contenedor === cs_tmp[i].contenedor) {
            if (cont.cantidad > 0) {
              cs_tmp[i].cantidad = cont.cantidad;
            } else {
              cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]), 1);
            }
            return true;
          }
        }
        return false;
      };

      function buscar_mueble(ms_tmp, m) {
        var l = ms_tmp.length;
        for (var i = 0; i < l; i++) {
          if (m.mueble === ms_tmp[i].mueble && m.especificacion === ms_tmp[i].especificacion) {
            if (Number(m.cantidad) > 0) {
              ms_tmp[i].cantidad = m.cantidad;
              ms_tmp[i].total_punto = m.total_punto;
            } else {
              ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]), 1);
            }
            return true;
          }
        }
        return false;
      }

      function buscar_otros(ms_tmp, m) {
        var l = ms_tmp.length;
        for (var i = 0; i < l; i++) {
          if (m.id === ms_tmp[i].id) {
            if (m.cantidad > 0) {
              ms_tmp[i].mueble = m.mueble;
              ms_tmp[i].ancho = m.ancho;
              ms_tmp[i].largo = m.largo;
              ms_tmp[i].alto = m.alto;
              ms_tmp[i].cantidad = m.cantidad;
              ms_tmp[i].descripcion = m.descripcion;
              ms_tmp[i].total_punto = m.punto * m.cantidad;
            } else {
              ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]), 1);
            }
            return true;
          }
        }
        return false;
      }
    //Controlador para generar PDF
      $scope.exportAction = function(event){
      switch(event){
          case "pdf": $scope.$broadcast("export-pdf", {});
                      break;
          case "excel": $scope.$broadcast("export-excel", {});
                      break;
          case "doc": $scope.$broadcast("export-doc", {});
                      break;
          default: console.log("no event caught");
       }
      }

      // function groupBy(array, f) {
      //   var groups = {};
      //   array.forEach(function (o) {
      //     var group = JSON.stringify(f(o));
      //
      //     groups[group] = groups[group] || [];
      //     groups[group].push(o);
      //   });
      //   return Object.keys(groups).map(function (group) {
      //     return groups[group];
      //   });
      // }
  Mueble.all().then(function (r) {
    // $scope.muebles = groupBy(r, function (item) {
    //   return [item.mueble, item.descripcion];
    // });
  angular.forEach(r, function (v, k) {

    v.cantidad = 0;

  },r);

  $scope.muebles = r;

  });
      // $scope.muebles = groupBy(muebles_resolve, function (item) {
      //   return [item.especificacion, item.descripcion];
      // });

      // $scope.mater=materiales_resolve;
      // $scope.materiales = angular.copy(materiales_resolve);

      function init(contenedor) {
        if (contenedor !== undefined) {
          return Contenedor.all(contenedor).then(function (contenedores) {
            $scope.todoscontenedores = contenedores;
          });
        } else {
            select();
          Material.all().then(function (r) {
            var out = [];
            angular.forEach(r, function (v, k) {
              var m = angular.copy(v);
              m.precio = Number(m.precio);
              m.cantidad = 0;
              m.ncontenedor = 0;
              m.iscontenedor = false;
              out.push(m);
            }, out);
            $scope.materiales = out;
          });

          Users.all(1).then(function (r) {
            $scope.cotizadores = r;
          });
          Users.all(2).then(function (r) {
            $scope.telefonista = r;
          });
          Direccion.all().then(function (r) {
            $scope.barrio_provincias = r;
          });
          Contenedor.all().then(function (contenedores) {
            var out = [];
            angular.forEach(contenedores, function (v, k) {
              var m = angular.copy(v);
              m.cantidad = 0;
              out.push(m);
            }, out);
            $scope.contenedores = out;
            console.log($scope.contenedores);
          });

          Mueble.tipo_mueble().then(function (muebles) {

            $scope.tipo_muebles = muebles;

          }).catch(function () {
            $scope.tipo_muebles = [];
          });
          $scope.fuentes = Cotizacion.all_fuentes();


        }

        $rootScope.$on('change', function (event) {
          if ($scope.contenedores_temp.length === 0 && $scope.otros_temp.length === 0 && $scope.muebles_temp.length === 0) {
            $rootScope.resumen = false;
          } else {
            $rootScope.resumen = true;
          }
        });

      };

      init();


      $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);

      $rootScope.margen = Number($scope.cotizacion.porcentaje_margen);

      $scope.$on('change_margen',function(){
        setTimeout(function(){
          $rootScope.margen = Number($scope.cotizacion.porcentaje_margen);
          $scope.$apply();
        },0)
      })


      //Methods
      $scope.check = function (n) {
        n = Number(n) + 1;
        // n === '0' ? n = '1' : n = '0';
        // return n.toString();
        return n;
      };
      $scope.checkc = function (n) {
        n === '0' ? n = '1' : n = '0';
        return n;
      };

      $scope.add_contenedor = function (contenedor, uni) {

        var contenedor_temp = {
          descripcion: contenedor.contenedor,
          contenedor: contenedor.id,
          cantidad: Number(uni),
          punto: 0
        };

        init(contenedor.id).then(function () {
          if (!buscar_contenedor($scope.contenedores_temp, contenedor_temp)) {
            if (Number(contenedor_temp.cantidad) > 0) {
              $scope.contenedores_temp.push(contenedor_temp);
            }
          }

          //chequear que no sea un material


          $scope.contenedores_temp = cal_punto($scope.contenedores_temp, $scope.todoscontenedores);
          $scope.metros3_contenedores = calcular_totales($scope.contenedores_temp, "punto") / 10;
          $scope.unidades_contenedores = calcular_totales($scope.contenedores_temp, "cantidad");
          check_material(contenedor_temp);
          $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);
          $scope.update_presupuesto()
        });

      };

      function check_material(contenedor){
        angular.forEach($scope.materiales, function(v,k){
          var mat = angular.copy(v);
          if(Number(mat.contenedor) === Number(contenedor.contenedor)){
            setTimeout(function(){
              mat.cantidad = contenedor.cantidad;
              mat.iscontenedor = true;
              mat.ncontenedor = contenedor.cantidad;
              $scope.materiales.splice($scope.materiales.indexOf(v),1);
              $scope.materiales.push(mat);
              $scope.add_material(mat);
                $scope.$apply();
            },0);

      return true;
          }
        })
      }

      $rootScope.limpiar = function () {
        setTimeout(function(){
          $('.btnSeleccionado').children('div').children('span.remover').click();
          $('.btnSeleccionado').children('.classContenedores').children('span.remover').click();
          $scope.contenedores_temp = [];
          $scope.muebles_temp = [];
          $scope.otros_temp = [];
          $scope.otros_temp_campo = [];
          $scope.materiales_temp = [];

          // //Variables De Totales
          $scope.metros3_contenedores = 0;
          $scope.unidades_contenedores = 0;
          $scope.metros3_muebles = 0;
          $scope.unidades_muebles = 0;
          $scope.metros3_otros = 0;
          $scope.unidades_otros = 0;
          $scope.$apply();
        },0);

      };

      $scope.add_mueble = function (mueble, uni) {
        var mueble_temp = {
          mueble: mueble.mueble,
          especificacion: mueble.especificacion,
          descripcion: "",
          ancho: Number(mueble.ancho),
          largo: Number(mueble.largo),
          alto: Number(mueble.alto),
          cantidad: Number(uni),
          punto: Number(mueble.punto),
          total_punto: Number(Number(uni) * Number(mueble.punto)),
          estado: "activo"
        };

        if (buscar_mueble($scope.muebles_temp, mueble_temp) !== true) {
          if (Number(mueble_temp.cantidad) > 0) {
            $scope.muebles_temp.push(mueble_temp);
          }
        }
        $scope.metros3_muebles = calcular_totales($scope.muebles_temp, "total_punto") / 10;
        $scope.unidades_muebles = calcular_totales($scope.muebles_temp, "cantidad");
        $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);
      };

      $scope.add_otros = function (campo, mueble, ancho, largo, alto, cant, descripcion, otro) {
        if (ancho !== undefined && largo !== undefined && alto !== undefined && mueble) {
          var otro = {
            id: campo.id,
            mueble: mueble,
            descripcion: descripcion,
            especificacion: "",
            ancho: Number(ancho),
            largo: Number(largo),
            alto: Number(alto),
            cantidad: Number(cant),
            punto: 0,
            total_punto: 0,
            estado: "activo"
          };
          var mult_dimension = otro.ancho * otro.largo * otro.alto;

          if (mueble === 'Otros') {
            otro.descripcion = descripcion;
          } else {
            otro.descripcion = mueble;
          }

          otro.punto = Math.round(otro.ancho * otro.largo * otro.alto / 100000);
          if (otro.punto === 0) {
            otro.punto = 1;
          }
          otro.total_punto = otro.punto * otro.cantidad;
          if (buscar_otros($scope.otros_temp, otro) !== true) {
            if (otro.cantidad > 0) {
              $scope.otros_temp.push(otro);
            }
          }
          $scope.metros3_otros = calcular_totales($scope.otros_temp, "total_punto") / 10;
          $scope.unidades_otros = calcular_totales($scope.otros_temp, "cantidad");
          $rootScope.total_m3 = Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros);
        } else {
          alert('Seleccione primero la descripción');
        }

      };

      $scope.add_campo = function () {
        $scope.otro_temp = { id: Math.floor(Math.random() * 1000 + 1) };
        $scope.otros_temp_campo.push($scope.otro_temp);
      };

      $scope.delete_campo = function (campo) {
        for (var i = 0; i < $scope.otros_temp.length; i++) {
          if ($scope.otros_temp[i].id === campo.id) {
            $scope.otros_temp.splice($scope.otros_temp.indexOf($scope.otros_temp[i]), 1);
          }
        }
        $scope.otros_temp_campo.splice($scope.otros_temp_campo.indexOf(campo), 1);
      };
    $rootScope.actFecha = function(){
      setTimeout(function(){
        $scope.cotizacion.hora_de_cotizacion = new Date();
        $scope.cotizacion.fecha_de_cotizacion = new Date();
        $scope.$apply();
      },0);
    }
      $rootScope.save = function() {
        var self = $scope.cotizacion;

        Cliente.save($scope.cliente).then(function(r){

          if(r.status===201){

            $scope.cliente.id = r.data.id;

            var cotizacion_temp = {

              "numero_cotizacion": self.numero_cotizacion,
              "clienteId": $scope.cliente.id,
              "cotizadorId": self.cotizador.id,
              "fuente": self.fuente,
              "cp_pv": self.cp_pv,
              "tipo_cliente": self.tipo_cliente,
              "cargo": self.cargo,
              "forma_pago": self.forma_pago ,
              "fecha_estimada_mudanza": fecha_format(self.fecha_estimada_mudanza),
              "hora_estimada_mudanza": hora_format(self.hora_estimada_mudanza),
              "fecha_de_cotizacion": fecha_format(self.fecha_de_cotizacion),
              "hora_de_cotizacion": hora_format(self.hora_de_cotizacion),
              "direccion_origen": self.direccion_origen,
              "barrio_provincia_origen":self.barrio_provincia_origen,
              "observacion_origen": self.observacion_origen,
              "direccion_destino": self.direccion_destino,
              "barrio_provincia_destino": self.barrio_provincia_destino,
              "observacion_destino": self.observacion_destino,
              "recorrido_km": self.recorrido_km,
              "precio_km": Number(self.precio_km).toFixed(2),
              "monto_km": Number(self.monto_km).toFixed(2),
              "tiempo_de_carga": self.tiempo_de_carga,
              "tiempo_de_descarga": self.tiempo_de_descarga,
              "numero_camion": self.numero_camion,
              "numero_ayudante": Number(self.numero_ayudante.num),
              "seguro": self.seguro,
              "desarme_mueble": self.desarme_mueble,
              "ambiente": Number(self.ambiente.num),
              "rampa": Number(self.rampa).toFixed(2),
              "mudanza": Number(self.mudanza).toFixed(2),
              "soga": Number(self.soga).toFixed(2),
              "embalaje": Number(self.embalaje).toFixed(2),
              "desembalaje": Number(self.desembalaje).toFixed(2),
              "materiales": Number(self.materiales).toFixed(2),
              "piano_cajafuerte": Number(self.piano_cajafuerte).toFixed(2),
              "porcentaje_ajuste":Number(self.porcentaje_ajuste).toFixed(2),
              "porcentaje_iva":Number(self.porcentaje_iva).toFixed(2),
              "ajuste": Number(self.ajuste).toFixed(2),
              "iva": Number(self.iva).toFixed(2),
              "subtotal1":Number(self.subtotal1).toFixed(2),
              "subtotal2":Number(self.subtotal2).toFixed(2),
              "total_monto": Number(self.total_monto).toFixed(2),
              "observacion": self.observacion,
              "total_cantidad": Number($scope.unidades_contenedores + $scope.unidades_muebles + $scope.unidades_otros),
              "total_m3": Number($scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros).toFixed(2),
              "porcentaje_margen": self.porcentaje_margen,
              "total_margen": self.total_margen,
              "estado": "activo"
            };

            if(self.seguro === 'Si'){
              cotizacion_temp.seguro = true;
            }else{
              cotizacion_temp.seguro = false;
            }
            if(self.desarme_mueble === 'Si'){
              cotizacion_temp.desarme_mueble = true;
            }else{
              cotizacion_temp.desarme_mueble = false;
            }
            if(self.rampa === 'Si'){
              cotizacion_temp.rampa = true;
            }else{
              cotizacion_temp.rampa = false;
            }

            Cotizacion.save(cotizacion_temp).then(function(cot){

              if(cot.status===201){

                for(var i=0;i<$scope.contenedores_temp.length;i++){
                    Cotizacion.save_contenedores($scope.contenedores_temp[i],cot.data.id);
                }
                for(var i=0;i<$scope.muebles_temp.length;i++){
                    Cotizacion.save_muebles($scope.muebles_temp[i],cot.data.id);
                }
                for(var i=0;i<$scope.otros_temp.length;i++){
                    Cotizacion.save_muebles($scope.otros_temp[i],cot.data.id);
                }
                for(var i=0;i<$scope.materiales_temp.length;i++){
                    Cotizacion.save_materiales($scope.materiales_temp[i],cot.data.id);
                }

                // $rootScope.nav = '1';
                $state.go('list');
                $scope.limpiar();

                $scope.cotizacion = {};
                select();
                $scope.cliente = {};
                $scope.materiales_temp = null;
                $scope.materiales_temp = [];
                // $scope.materiales = [];
                // $scope.cotizacion = angular.copy(cotizacion);
                $('#ncotizacion').focus();
                $scope.limpiarM = false;
                setTimeout(function () {
                  // $scope.materiales = angular.copy(materiales_resolve);
                  $scope.cotizacion = angular.copy(cotizacion);
                  $scope.cotizacion.numero_ayudante ={num:0};
                  $scope.cotizacion.ambiente ={num:0};
                  // $('.btnSeleccionado').children('.classContenedores').click();
                  $scope.limpiarM = true;
                  $scope.$apply();
                }, 100);
              }
            }).catch(function(){
                alert('ocurrio un error con el servidor');
            });


          }
        }).catch(function(){
          alert('ocurrio un error con el servidor');
        });

      }
      $scope.calcular_ajuste  = function () {
        var resultado=0;
        resultado=($scope.cotizacion.ajuste/$scope.cotizacion.subtotal1)*100;
        $scope.cotizacion.porcentaje_ajuste = resultado;
        $scope.cotizacion.subtotal2 = Number($scope.cotizacion.subtotal1 + $scope.cotizacion.ajuste)
        $scope.cotizacion.total_monto = Number($scope.cotizacion.subtotal2 + $scope.cotizacion.iva)
      }

      $scope.calcular_iva  = function () {
        var resultado=0;
        resultado=Number(($scope.cotizacion.subtotal2*$scope.cotizacion.porcentaje_iva)/100);
        $scope.cotizacion.iva = resultado;
        $scope.cotizacion.total_monto = Number($scope.cotizacion.subtotal2 + $scope.cotizacion.iva)
      }

      $scope.update_presupuesto = function () {
        setTimeout(function(){
            $scope.cotizacion.subtotal1 = $scope.cotizacion.mudanza + $scope.cotizacion.soga + $scope.cotizacion.embalaje + $scope.cotizacion.desembalaje + $scope.cotizacion.materiales + $scope.cotizacion.piano_cajafuerte + $scope.cotizacion.monto_km;
            $scope.calcular_ajuste();
            $scope.calcular_iva();
            $scope.$apply();
        },0);


      }
      angular.element('#nCotizacion').focus();

      //temploral de material
      $scope.materiales_temp = [];

    //   $scope.filtrado = function(cantidad){
    //     return function (item) {
    //
    //     //  if ((item.num) !== Number(cantidad))
    //     //  {
    //     //       return true;
    //     // }
    //     return false;
    // };
      // }
      $scope.check_object = function(cantidad){

        if(typeof(cantidad) === 'object'){

          return true;

        }else{

          return false;

        }

      }
      $scope.add_material = function (material) {

        if(typeof(material.cantidad) === 'object'){

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
          estado: "activo"
        };

        if (buscar_material($scope.materiales_temp, material_temp) !== true) {
          if (material_temp.cantidad > 0) {
            $scope.materiales_temp.push(material_temp);
          }
        }
        $scope.cotizacion.materiales = calcular_totales($scope.materiales_temp, "total");
        $scope.update_presupuesto();

          };

      function buscar_material(ms_tmp, m) {
        var l = ms_tmp.length;
        for (var i = 0; i < l; i++) {
          if (m.material === ms_tmp[i].material) {
            if (m.cantidad > 0) {
              ms_tmp[i].cantidad = m.cantidad;
              ms_tmp[i].precio_unitario = m.precio_unitario;
              ms_tmp[i].total = m.total;
            } else {
              ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]), 1);
            }
            return true;
          }
        }
        return false;
      }
      // temporal parcial_1
      // $scope.parcial1_temp = {};
      $scope.add_parcial1 = function () {
        $scope.cotizacion.monto_km = Number($scope.cotizacion.recorrido_km * $scope.cotizacion.precio_km);
        $scope.update_presupuesto();
      };

      $scope.cancelar = function(){
        setTimeout(function(){
          $state.go('list');
          $scope.$apply();
        },500)
      }

  }]);

  app.filter('unique', function () {

    return function (items, filterOn) {

      if (filterOn === false) {
        return items;
      }

      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var hashCheck = {},
            newItems = [];

        var extractValueToCompare = function (item) {
          if (angular.isObject(item) && angular.isString(filterOn)) {
            return item[filterOn];
          } else {
            return item;
          }

        };

        angular.forEach(items, function (item) {
          var valueToCheck,
              isDuplicate = false;

          for (var i = 0; i < newItems.length; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }
        });
        items = newItems;
      }
      return items;
    };
  });

})();
