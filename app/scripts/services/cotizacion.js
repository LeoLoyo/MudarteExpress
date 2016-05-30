(function(){
  'use strict';
  var app = angular.module('Express.services',[]);

    app.service('Auth', function($http, setting){
      var self = this;
      var users = [
        {
          name:"Leonardo Loyo",
          user:"leo",
          pass:"0000"
        },
        {
          name:"Administrador",
          user:"admin",
          pass:"admin"
        },
        {
          name:"Yusnelvy Arrieche",
          user:"yusnelvy",
          pass:"1234"
        },
        {
          name:"Yohandri",
          user:"yohandri",
          pass:"1234"
        },
        {
          name:"Jessica Rivero",
          user:"jessica",
          pass:"1234"
        }
      ];
      var response;

      self.valid = function(user){
        for(var i=0;i<users.length;i++){
            if(user.name === users[i]['user'] && user.pass === users[i]['pass']){
              return response =[{user:users[i],status:true}];
            }
          }
        return response =[{user:null,status:false}];
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
        var url = setting.url+"mueblecotizacion/";
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

          return $http.post(url, data).success(function(result){
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
        var url = setting.url + "contenedordescripcion/?format=json"
        // var url = 'scripts/json/contenedordescripcion.json'
        if(contenedor !== undefined){
          url = setting.url +"contenedor/?format=json&contenedor="+contenedor;
          // url = 'scripts/json/contenedor.json';
        }
        return $http.get(url).then(function(data){
          return data.data;
        }).catch(function(e){
          return null;
        });
      }
    });

    app.service('Material', function ($http, setting) {
      var self = this;
      self.all = function(){
          // url = setting.url + "/material/?format=json";
          var url = "scripts/json/material.json";
        return $http.get(url).then(function(data){
          var out =[];
          angular.forEach(data.data, function(value,key){
            value.precio =Number(value.precio);
            out.push(value);
          },out);
          // return data.data;
          console.log(out);
          return out;
        }).catch(function(e){
          return null;
        });
      }
    });

    app.service('Mueble', function ($http, setting) {
      var self = this;
      self.all = function(group){
       // var url = setting.url+"mueble/?format=json";
        var url = 'scripts/json/mueble.json';
        if(group !== undefined){
          url = setting.url+'muebledescripcion/?format=json';
          //url = 'scripts/json/muebledescripcion.json';
        }
        return $http.get(url).then(function(data){
          return data.data;
        }).catch(function(e){
          return null;
        });
      }
      self.tipo_mueble = function(){
        // var url = setting.url+"tipo_mueble/?format=json";
        var url = "scripts/json/tipo_mueble.json";
        return $http.get(url).then(function(data){
          return data.data;
        }).catch(function(e){
          return null;
        });
      }
      return self;

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

    app.service('Users', function ($http, setting) {
      var self = this;
      self.all = function(param){
        var url = '';
        switch(param){
          case 1:
            // url = setting.url+"user/?format=json&cotizador=cotizador";
            url = 'scripts/json/cotizador.json';
            break;

          case 2:
            // url = setting.url+"user/?format=json&telefonnista=telefonista";
            url = 'scripts/json/telefonista.json';
            break;
          default:
            url = 'scripts/json/user.json';
            break
        };

        return $http.get(url).then(function(data){
          return data.data;
        });
      }
    });


})();
