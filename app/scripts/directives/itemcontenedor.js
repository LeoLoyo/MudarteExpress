'use strict';

/**
 * @ngdoc directive
 * @name cotizacionExpressApp.directive:itemContenedor
 * @description
 * # itemContenedor
 */
var exportTable = function(){
var link = function($scope, elm, attr){
$scope.$on("export-pdf", function(e, d){
      $('.export-table').tableExport({type:'pdf',escape:'false'});
 });
}
return {
  restrict: "C",
  link: link
   }
 }
angular.module('cotizacionExpressApp').directive('itemContenedor', function () {
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: '../../views/_itemContenedor.html'
    // link: function postLink(scope, element, attrs) {
    //   element.text('this is the itemMuebles directive');
    // }
  };
})
.directive("exportTable", exportTable)

.directive('convertNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attr, ctrl) {
      ctrl.$parsers.push(function(value) {
        return parseInt(value, 10);
      });

      ctrl.$formatters.push(function(value) {
        return value.toString();
      });
    }
  }
});
