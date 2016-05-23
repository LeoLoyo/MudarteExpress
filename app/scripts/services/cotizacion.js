(function(){
  'use strict';
  var app = angular.module('Express.services',[]);

    app.service('Auth', function($http, setting){
      var self = this;
      self.valid = function(user){
        if(user.name === 'admin' && user.pass === 'admin'){
            return true;
        }else{
          return false;
        }
      };
    })

    app.service('Cotizacion', function ($http, setting) {
      var self = this;
      self.save = function(){
        return $http.post(setting.url+"cotizacion,",{})
      }
      return self;
    });

    app.service('Contenedor', function ($http, setting) {
      var self = this;
      self.all = function(contenedor){
        var url = setting.url + "contenedordescripcion/?format=json"
        if(contenedor !== undefined){
          url = setting.url +"contenedor/?format=json&contenedor="+contenedor;
        }
        return $http.get(url).then(function(data){
          return data.data;
        });
      }
    });

    app.service('Mueble', function ($http, setting) {
      var self = this;
      self.all = function(){
        return $http.get(setting.url+"mueble/?format=json").then(function(data){
          console.log("Mueble :" + data.data.length);
          return data.data;
        });
      }
    });

    app.service('Bulto', function ($http, setting) {
      var self = this;
      var collection = [];
      var object = {};

      self.all = function(){
        return $http.get(setting.url+"bulto/?format=json").then(function(data){
          console.log("Bultos :" + data.data.length);
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
          console.log(data.data[0]);
          return data.data[0];
        });
      }
    });

})();
