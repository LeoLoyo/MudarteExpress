'use strict';

describe('Controller: CotizaionctrlviewCtrl', function () {

  // load the controller's module
  beforeEach(module('cotizacionExpressApp'));

  var CotizaionctrlviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CotizaionctrlviewCtrl = $controller('CotizaionctrlviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CotizaionctrlviewCtrl.awesomeThings.length).toBe(3);
  });
});
