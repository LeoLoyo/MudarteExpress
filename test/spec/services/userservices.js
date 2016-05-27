'use strict';

describe('Service: UserServices', function () {

  // load the service's module
  beforeEach(module('cotizacionExpressApp'));

  // instantiate service
  var UserServices;
  beforeEach(inject(function (_UserServices_) {
    UserServices = _UserServices_;
  }));

  it('should do something', function () {
    expect(!!UserServices).toBe(true);
  });

});
