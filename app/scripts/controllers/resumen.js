(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('ResumenCtrl', function ($scope, Resumen,Cotizacion) {
        $scope.row = {
            contenedores:"Canasto",
            cantidadesCon:10,
            metrosCon:15};
  });
})();
