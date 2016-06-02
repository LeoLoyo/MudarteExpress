'use strict';

/**
 * @ngdoc directive
 * @name cotizacionExpressApp.directive:itemContenedor
 * @description
 * # itemContenedor
 */
angular.module('cotizacionExpressApp')
.directive('itemContenedor', function () {
  return {
    restrict: 'AE',
    scope:true,
    templateUrl: '../../views/_itemContenedor.html'
    // link: function postLink(scope, element, attrs) {
    //   element.text('this is the itemMuebles directive');
    // }
  };
});
