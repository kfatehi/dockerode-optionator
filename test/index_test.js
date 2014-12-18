var expect = require('chai').expect
  , index = require('../index')

describe("#normalizeOptions()", function() {
  var fn = index.normalizeOptions;
  describe("passing in nothing", function() {
    it("defaults to default socket path (/var/run/docker.sock)", function() {
      expect(fn({}, {})).to.deep.eq({
        socketPath: "/var/run/docker.sock"
      })
    });
  });
  describe("using environment variables DOCKER_IP and DOCKER_PORT", function() {
    it("returns expected dockerode connection structure", function() {
      var out = fn({}, {
        DOCKER_IP: "127.0.0.1",
        DOCKER_PORT: "4243"
      })
      expect(out).to.deep.eq({
        host: "127.0.0.1",
        port: "4243"
      })
    });
  });

  describe("using environment variable DOCKER_HOST", function() {
    it("understands http://127.0.0.1:4243", function() {
      var out = fn({}, { DOCKER_HOST: "http://127.0.0.1:4243" })
      expect(out).to.deep.eq({
        host: "127.0.0.1",
        port: 4243
      })
    });
    it("understands unix:///var/run/docker.sock", function() {
      var out = fn({}, { DOCKER_HOST: "unix:///var/run/docker.sock" })
      expect(out).to.deep.eq({
        socketPath: "/var/run/docker.sock"
      })
    });
    it("understands /var/run/docker.sock", function() {
      var out = fn({}, { DOCKER_HOST: "/var/run/docker.sock" })
      expect(out).to.deep.eq({
        socketPath: "/var/run/docker.sock"
      })
    });
    it("understands tcp://127.0.0.1:4243", function() {
      var out = fn({}, { DOCKER_HOST: "tcp://127.0.0.1:4243" })
      expect(out).to.deep.eq({
        host: "127.0.0.1",
        port: 4243
      })
    });
  });

  describe("loading certs", function() {
    it("loads certs if DOCKER_CERT_PATH valid", function() {
      var out = fn({}, { DOCKER_CERT_PATH: __dirname + '/certs' });

      expect(out).to.have.ownProperty('ca');
      expect(out).to.have.ownProperty('cert');
      expect(out).to.have.ownProperty('key');
    });

    it("ignores if DOCKER_CERT_PATH is invalid", function() {
      var out = fn({}, { DOCKER_CERT_PATH: __dirname + '/certz' });

      expect(out).to.not.have.ownProperty('ca');
      expect(out).to.not.have.ownProperty('cert');
      expect(out).to.not.have.ownProperty('key');
    });

    it("ignores if DOCKER_CERT_PATH is not set", function() {
      var out = fn({}, {});

      expect(out).to.not.have.ownProperty('ca');
      expect(out).to.not.have.ownProperty('cert');
      expect(out).to.not.have.ownProperty('key');
    });
  });
});
