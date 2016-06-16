(function () {
  'use strict';

  var app = angular.module('cotizacionExpressApp', ['Express.router', 'Express.controllers', 'Express.services', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngSanitize', 'ngTouch']);

  app.constant('setting', {
    "url": "http://localhost:8000/api/v1/",
    //"url":"http://192.168.0.115:8000/api/v1/",
    "user": { "name": "admin", "pass": "admin" }
  });

  app.service('Session', function () {
    var session = false;
    return {
      get: function () {
        return session;
      },
      set: function (bool) {
        session = bool;
        return session;
      }
    };
  });

  angular.module('Express.controllers', ['Backend']);
})();
