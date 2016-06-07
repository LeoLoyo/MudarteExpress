'use strict';

angular.module('cotizacionExpressApp').directive('itemMuebles', function () {
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: '../../views/_itemMuebles.html'
    // link: function postLink(scope, element, attrs) {
    //   element.text('this is the itemMuebles directive');
    // }
  };
});
