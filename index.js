'use strict';

var URI = require('uri-js');

module.exports = {
  normalizeOptions: function (options, env) {
    var host = options.host || env.DOCKER_IP;
    var port = options.port || env.DOCKER_PORT;
    var fullHost = options.docker_host || env.DOCKER_HOST;
    var certsPath = options.certsPath || env.DOCKER_CERT_PATH;
    var out = {};

    if (host && port) {
      out.host = host;
      out.port = port;
    } else if (fullHost) {
      var uri = URI.parse(fullHost);

      if (uri.scheme === 'http' || uri.scheme === 'tcp') {
        out.host = uri.host;
        out.port = uri.port;
      } else if (uri.scheme === 'unix' || uri.path) {
        out.socketPath = uri.path;
      } else {
        throw new Error('Could not normalize options from DOCKER_HOST');
      }
    } else {
      out.socketPath = '/var/run/docker.sock';
    }

    if (certsPath) {
      out = loadCerts(certsPath);
    }

    return out;
  }
};

function loadCerts(folder, obj) {
  var path = require('path');
  var fs = require('fs');
  var certs = ['ca', 'cert', 'key'];
  var result = obj || {};

  if (!folder || !fs.existsSync(folder)) {
    return result;
  }

  certs.forEach(function (key) {
    result[key] = fs.readFileSync(path.join(folder, key + '.pem'));
  });

  return result;
}
