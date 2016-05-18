(function(){
  'use strict';
  var app = angular.module('Express.services',[]);
    app.service('Resumen', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://192.168.0.114:8000/api/v1/resumen/?format=json").then(function(data){
          console.log(data.data);
        });
      }
    });


})();
