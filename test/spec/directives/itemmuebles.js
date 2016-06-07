'use strict';

describe('Directive: itemMuebles', function () {

  // load the directive's module
  beforeEach(module('cotizacionExpressApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<item-muebles></item-muebles>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the itemMuebles directive');
  }));
});
