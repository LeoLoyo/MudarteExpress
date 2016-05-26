(function(){
  'use strict';
  var app = angular.module('Express.services',[]);

    app.service('Auth', function($http, setting){
      var self = this;
      self.valid = function(user){
        // $http.get(setting.url).then(function(){}).catch(function(){})
        if(user.name === setting.user.name && user.pass === setting.user.pass){
            return true;
        }else{
          return false;
        }
      };
    })

    app.service('Cotizacion', function ($http, setting) {
      var self = this;
      self.save = function(cotizacion){
        return $http.post(setting.url+"cotizacion/",cotizacion).success(function(responde){
          return responde.id;
        }).error(function(e){
          return e;
        });
      }

      self.save_contenedores = function(contenedor,id_cotizacion){
        var data = {};
          data.cotizacion = id_cotizacion;
          data.descripcion = contenedor.contenedor;
          data.cantidad = contenedor.unidad;
          data.punto = contenedor.punto;
          data.estado ='activo';
          return $http.post(setting.url+"contenedorcotizacion/", data).success(function(result){
            return true;
          }).error(function(e){
            return false;
          });

      }
      self.save_muebles = function(muebles,id_cotizacion){
        var data = {};

          data.cotizacion = id_cotizacion;
          data.mueble = muebles.mueble;
          data.descripcion = muebles.descripcion;
          data.alto = muebles.alto;
          data.ancho = muebles.ancho;
          data.largo = muebles.largo;
          data.cantidad = muebles.cantidad;
          data.punto = muebles.punto;
          data.total_punto = muebles.total_punto;
          data.estado ='activo';

          return $http.post(setting.url+"mueblecotizacion/", data).success(function(result){
            return true;
          }).error(function(e){
            return false;
          });
        }


      return self;
    });

    app.service('Contenedor', function ($http, setting) {
      var self = this;
      self.all = function(contenedor){
        // var url = setting.url + "contenedordescripcion/?format=json"
        var url = 'scripts/json/contenedordescripcion.json'
        if(contenedor !== undefined){
          // url = setting.url +"contenedor/?format=json&contenedor="+contenedor;
          url = 'scripts/json/contenedor.json';
        }
        return $http.get(url).then(function(data){
          return data.data;
        }).catch(function(e){
          return null;
        });
      }
    });

    app.service('Mueble', function ($http, setting) {
      var self = this;
      self.all = function(){
        return $http.get(setting.url+"mueble/?format=json").then(function(data){
          console.log("Mueble :" + data.data.length);
          return data.data;
        }).catch(function(e){
          return null;
        });
      }
    });

    app.service('Bulto', function ($http, setting) {
      var self = this;
      var collection = [];
      var object = {};

      self.all = function(){
        return $http.get(setting.url+"bulto/?format=json").then(function(data){
          // console.log("Bultos :" + data.data.length);
          collection = data.data;
          return collection
        });
      };

      self.find = function(mueble){
        for(var i = 0;i<collection.length;i++){
                if(mueble.alto === collection[i].alto && mueble.largo === collection[i].ancho){
                  object = collection[i];
                  return object;
                }
              };
        };
      });

    app.service('Cliente', function ($http, setting) {
      var self = this;
      self.all = function(){
        return $http.get(setting.url+"cliente/?format=json").then(function(data){
          // console.log(data.data[0]);
          return data.data[0];
        });
      }
    });

})();
