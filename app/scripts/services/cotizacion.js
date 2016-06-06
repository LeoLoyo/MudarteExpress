(function () {
  'use strict';

  var app = angular.module('Express.services', []);
  app.factory('API',['$http', '$q', function ($http, $q) {
    var self = this;

    // Handle query's and potential errors
    self.query = function (url, parameters) {
      parameters = parameters || [];
      var q = $q.defer();

      $http.get(url).then(function (result) {
        q.resolve(result);
      }).catch(function (error) {
        console.warn(error);
        q.reject(error);
      });
      return q.promise;
    };
    self.getAll = function (result) {
      var output = [];
      for (var i = 0; i < result.data.length; i++) {
        output.push(result.data[i]);
      }
      return output;
    };

    // // Proces a single result
    // self.getById = function(result) {
    //   var output = null;
    //   output = angular.copy(result.rows.item(0));
    //   return output;
    // }

    return self;
  }]);
  app.service('Auth', function () {
    var self = this;
    var users = [{
      name: "Leonardo Loyo",
      user: "leo",
      pass: "0000"
    }, {
      name: "Administrador",
      user: "admin",
      pass: "admin"
    }, {
      name: "Yusnelvy Arrieche",
      user: "yusnelvy",
      pass: "1234"
    }, {
      name: "Yohandri",
      user: "yohandri",
      pass: "1234"
    }, {
      name: "Jessica Rivero",
      user: "jessica",
      pass: "1234"
    }];
    var response;

    self.valid = function (user) {
      for (var i = 0; i < users.length; i++) {
        if (user.name === users[i].user && user.pass === users[i].pass) {
          return response = [{ user: users[i], status: true }];
        }
      }
      return response = [{ user: null, status: false }];
    };
  });

  app.service('Cotizacion',['$http', 'setting', function ($http, setting) {
    var self = this;
    self.save = function (cotizacion) {
      return $http.post(setting.url + "cotizacion/", cotizacion).success(function (responde) {
        return responde;
      }).error(function (e) {
        return e;
      });
    };

    self.save_contenedores = function (contenedor, id_cotizacion) {
      var data = {};
      data.cotizacion = id_cotizacion;
      data.descripcion = contenedor.contenedor;
      data.cantidad = contenedor.unidad;
      data.punto = contenedor.punto;
      data.estado = 'activo';
      return $http.post(setting.url + "contenedorcotizacion/", data).success(function () {
        return true;
      }).error(function () {
        return false;
      });
    };
    self.save_muebles = function (muebles, id_cotizacion) {
      var data = {};
      var url = setting.url + "mueblecotizacion/";
      data.cotizacion = id_cotizacion;
      data.mueble = muebles.mueble;
      data.descripcion = muebles.descripcion;
      data.alto = muebles.alto;
      data.ancho = muebles.ancho;
      data.largo = muebles.largo;
      data.cantidad = muebles.cantidad;
      data.punto = muebles.punto;
      data.total_punto = muebles.total_punto;
      data.estado = 'activo';

      return $http.post(url, data).success(function () {
        return true;
      }).error(function () {
        return false;
      });
    };

    self.all_fuentes = function () {
      var collection = ['Internet Google', 'Internet Otro buscador', 'Internet Banner', 'Cartel Via Publica', 'Recomendado Cliente', 'Cliente', 'Volante diario/revista', 'Volante via publica', 'Volante en casa', 'Volante en evento', 'Publ. Diario/revista', 'Public. Email', 'Public. Via Publica', 'Publicidad TV', 'Pulicidad Radio', 'Publicidad Cine', 'Camion Mudarte', 'Telemercadeo', 'Deposito Belgrano', 'Inmobiliaria', 'Tarjeta descuento', 'Otros', 'My Home Planners'];
      return collection;
    };
    return self;
  }]);

  app.factory('Contenedor',['API', 'setting', function (API, setting) {
    var self = this;
    self.all = function (contenedor) {
      var url = setting.url + "contenedordescripcion/?format=json";
      // var url = 'scripts/json/contenedordescripcion.json'
      if (contenedor !== undefined) {
        url = setting.url + "contenedor/?format=json&contenedor=" + contenedor;
        // url = 'scripts/json/contenedor.json';
      }
      return API.query(url).then(function (result) {
        return API.getAll(result);
      });
    };
    return self;
  }]);

  app.service('Material',['API', 'setting', function (API, setting) {
    var self = this;
    self.all = function () {
      var url = setting.url + "material/?format=json";
      // var url = "scripts/json/material.json";

      return API.query(url).then(function (result) {
        return API.getAll(result);
      });
    };
    return self;
  }]);

  app.factory('Mueble',['API', 'setting', function (API, setting) {

    var self = this;
    self.all = function () {
       var url = setting.url+"mueble/?format=json";
      // var url = 'scripts/json/mueble.json';

      return API.query(url).then(function (result) {
        return API.getAll(result);
      });
    };

    self.tipo_mueble = function () {
      var url = setting.url + "tipo_mueble/?format=json";
      // var url = "scripts/json/tipo_mueble.json";
      return API.query(url).then(function (result) {
        return API.getAll(result);
      });
    };
    return self;
  }]);

  app.service('Bulto',['$http', 'setting', function ($http, setting) {
    var self = this;
    var collection = [];
    var object = {};

    self.all = function () {
      return $http.get(setting.url + "bulto/?format=json").then(function (data) {
        // console.log("Bultos :" + data.data.length);
        collection = data.data;
        return collection;
      });
    };

    self.find = function (mueble) {
      for (var i = 0; i < collection.length; i++) {
        if (mueble.alto === collection[i].alto && mueble.largo === collection[i].ancho) {
          object = collection[i];
          return object;
        }
      }
    };
  }]);

  app.service('Cliente',['$http', 'setting', function ($http, setting) {
    var self = this;
    self.all = function () {
      return $http.get(setting.url + "cliente/?format=json").then(function (data) {
        // console.log(data.data[0]);
        return data.data[0];
      });
    };
    self.save = function(cliente){
      return $http.post(setting.url+"cliente/",cliente).success(function(responde){
        return responde.id;
      }).error(function(e){
        return e;
      });
    };
  }]);

  app.service('Users',['$http', 'setting', function ($http, setting) {
    var self = this;
    self.all = function (param) {
      var url = '';
      switch (param) {
        case 1:
          url = setting.url + "user/?format=json&cotizador=cotizador";
          // url = 'scripts/json/cotizador.json';
          break;

        case 2:
          url = setting.url + "user/?format=json&telefonista=telefonista";
          // url = 'scripts/json/telefonista.json';
          break;
        default:
          url = 'scripts/json/user.json';
          break;
      }

      return $http.get(url).then(function (data) {
        return data.data;
      });
    };
  }]);

  app.factory('Direccion',['API', function (API) {

    var self = this;

    self.all = function () {

      var url = 'scripts/json/barrioprovincia.json';
      return API.query(url).then(function (result) {
        return API.getAll(result);
      });
    };
    return self;
  }]);

})();
