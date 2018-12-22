'use strict';

var createError = require('errno').create;

var RitocoreNodeError = createError('RitocoreNodeError');

var RPCError = createError('RPCError', RitocoreNodeError);

module.exports = {
  Error: RitocoreNodeError,
  RPCError: RPCError
};
