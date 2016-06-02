'use strict';

describe('Directive: itemContenedor', function () {

  // load the directive's module
  beforeEach(module('cotizacionExpressApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<item-contenedor></item-contenedor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the itemContenedor directive');
  }));
});
