'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export ritocore-lib', function() {
    var ritocore = require('../');
    should.exist(ritocore.lib);
    should.exist(ritocore.lib.Transaction);
    should.exist(ritocore.lib.Block);
  });
});
