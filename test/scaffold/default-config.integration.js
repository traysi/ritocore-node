'use strict';

var path = require('path');
var should = require('chai').should();
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('#defaultConfig', function() {
  var expectedExecPath = path.resolve(__dirname, '../../bin/ritod');

  it('will return expected configuration', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'ritod',
        'web'
      ],
      servicesConfig: {
        ritod: {
          spawn: {
            datadir: process.env.HOME + '/.ritocore/data',
            exec: expectedExecPath
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.ritocore/ritocore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig();
    info.path.should.equal(home + '/.ritocore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal(['ritod', 'web']);
    var ritod = info.config.servicesConfig.ritod;
    should.exist(ritod);
    ritod.spawn.datadir.should.equal(home + '/.ritocore/data');
    ritod.spawn.exec.should.equal(expectedExecPath);
  });
  it('will include additional services', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'ritod',
        'web',
        'insight-api',
        'insight-ui'
      ],
      servicesConfig: {
        ritod: {
          spawn: {
            datadir: process.env.HOME + '/.ritocore/data',
            exec: expectedExecPath
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.ritocore/ritocore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig({
      additionalServices: ['insight-api', 'insight-ui']
    });
    info.path.should.equal(home + '/.ritocore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal([
      'ritod',
      'web',
      'insight-api',
      'insight-ui'
    ]);
    var ritod = info.config.servicesConfig.ritod;
    should.exist(ritod);
    ritod.spawn.datadir.should.equal(home + '/.ritocore/data');
    ritod.spawn.exec.should.equal(expectedExecPath);
  });
});
