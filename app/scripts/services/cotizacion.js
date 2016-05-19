(function(){
  'use strict';
  var app = angular.module('Express.services',[]);
    app.service('Cotizacion', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://192.168.0.114:8000/api/v1/mueble/?format=json").then(function(data){
          console.log(data.data);
        });
      }
    });
    app.service('Contenedor', function ($http) {
      var self = this;
      self.all = function(contenedor){
        //var url = "http://192.168.0.114:8000/api/v1/contenedordescripcion/?format=json"
        var url = "http://localhost:8000/api/v1/contenedordescripcion/?format=json"
        if(contenedor !== undefined){
          url = "http://localhost:8000/api/v1/contenedor/?format=json&contenedor="+contenedor;
        }
        return $http.get(url).then(function(data){
          console.log(data.data);
          return data.data;
        });
      }
    });

    app.service('Mueble', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://192.168.0.114:8000/api/v1/mueble/?format=json").then(function(data){
          console.log(data.data);
           return data.data;
        });
      }
    });



})();
