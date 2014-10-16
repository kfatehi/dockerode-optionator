var URI = require('uri-js');

module.exports = {
  normalizeOptions: function (options, env) {
    var host = options.host || env.DOCKER_IP
    var port = options.port || env.DOCKER_PORT
    var full_host = options.docker_host || env.DOCKER_HOST
    var out = {};
    if (host && port) {
      out.host = host
      out.port = port
    } else if (full_host) {
      var uri = URI.parse(full_host);
      if (uri.scheme === "http" || uri.scheme === "tcp") {
        out.host = uri.host
        out.port = uri.port
      } else if (uri.scheme === "unix" || uri.path) {
        out.socketPath = uri.path
      } else {
        throw new Error("Could not normalize options from DOCKER_HOST")
      }
    } else {
      out.socketPath = '/var/run/docker.sock'
    }
    return out;
  }
}
