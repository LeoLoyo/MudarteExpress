(function(){
  'use strict';
  var app = angular.module('Express.services',[]);

    app.service('Cotizacion', function ($http) {
      var contenedores = [];
      var muebles = [];
      var otros = [];

    return{
      get:function(){
        return contenedores;
      },
      save_contenedores:function(array){
        contenedores = array;
        return true;
      }
  }
    });

    app.service('Contenedor', function ($http) {
      var self = this;
      self.all = function(contenedor){
        var url = "http://localhost:8000/api/v1/contenedordescripcion/?format=json"
        if(contenedor !== undefined){
          url = "http://localhost:8000/api/v1/contenedor/?format=json&contenedor="+contenedor;
        }
        return $http.get(url).then(function(data){
          // console.log("Contenedores :" + data.data.length);
          return data.data;
        });
      }
    });

    app.service('Mueble', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://localhost:8000/api/v1/mueble/?format=json").then(function(data){
          console.log("Mueble :" + data.data.length);
          return data.data;
        });
      }
    });

    app.service('Bulto', function ($http) {
      var self = this;
      var collection = [];
      var object = {};

      self.all = function(){
        return $http.get("http://localhost:8000/api/v1/bulto/?format=json").then(function(data){
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

    app.service('Cliente', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://localhost:8000/api/v1/cliente/?format=json").then(function(data){
          console.log(data.data[0]);
          return data.data[0];
        });
      }
    });

})();
