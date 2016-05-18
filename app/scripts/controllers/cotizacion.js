(function(){
  var app = angular.module('cotizacionExpressApp');
    app.controller('CotizacionCtrl', function ($scope, Cotizacion) {
      Cotizacion.all().then(function(muebles){
        console.log(true);
      });
  });
})();
