(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('LoginCtrl', function ($scope) {
      var array = [
        {codigo:1, descripcion:"Cama KingSize",metros:10},
        {codigo:2, descripcion:"Cama QueenSize",metros:8}
      ];
      $scope.muebles  = array;
    setTimeout(function(){
      console.log("funcionando");
      $scope.$apply(function(){
        $scope.muebles.push({codigo:3, descripcion:"Cama Prueba",metros:7});
      });

    },5000);

  });
})();
