(function(){
  'use strict';
  var app = angular.module('Express.services',[]);

    app.service('Cotizacion', function ($http) {
<<<<<<< HEAD
      var self = this;
      self.all = function(){
        return $http.get("http://localhost:8000/api/v1/mueble/?format=json").then(function(data){
          console.log(data.data);
        });
=======
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
>>>>>>> a899b97d38b93653d283e98ec46dba28ecf1613b
      }
  }
    });

    app.service('Contenedor', function ($http) {
      var self = this;
      self.all = function(contenedor){
<<<<<<< HEAD
        var url = "http://localhost:8000/api/v1/contenedordescripcion/?format=json"
        if(contenedor !== undefined){
          url = "http://localhost:8000/api/v1/contenedor/?format=json&contenedor="+contenedor;
=======
        var url = "http://192.168.0.114:8000/api/v1/contenedordescripcion/?format=json"
        // var url = "/scripts/contenedores.json";
        if(contenedor !== undefined){
          url = "http://192.168.0.114:8000/api/v1/contenedor/?format=json&contenedor="+contenedor;
          // url = "/scripts/contenedorestodos.json";
>>>>>>> a899b97d38b93653d283e98ec46dba28ecf1613b
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
