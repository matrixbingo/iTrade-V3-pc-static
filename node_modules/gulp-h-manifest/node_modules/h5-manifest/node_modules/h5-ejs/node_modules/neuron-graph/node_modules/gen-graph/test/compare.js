"use strict";

/* global describe, it */

var assert = require('chai').assert;

var isIsomorphism = require('../lib/iso');

describe('compare', function() {

  it('compare', function() {
    assert(isIsomorphism({
      from: "json@~1.0.0",
      version: "1.0.1"
    }, {
      from: "json@^1.0.0",
      version: "1.0.1"
    }));

  });


  function testCase(name) {
    it(name + ' tree', function() {
      var a = require('./fixtures/' + name);
      var b = JSON.parse(JSON.stringify(a));
      assert(a !== b && isIsomorphism(a, b));
    });
  }

  function notEqual(a, b) {

    it(a + ' not like ' + b, function() {
      var oa = require('./fixtures/' + a);
      var ob = require('./fixtures/' + b);

      assert(oa !== ob && !isIsomorphism(oa, ob));
    });
  }

  ['async', 'ab', 'self', 'simple', 'nested', 'nodev', 'cycle', 'mixed', 'branch'].forEach(testCase);

  notEqual('async', 'self');
  notEqual('ab', 'simple');
  notEqual('self', 'simple');
  notEqual('simple', 'nested');
  notEqual('nodev', 'cycle');
  notEqual('mixed', 'cycle');
  notEqual('branch', 'cycle');
  notEqual('branch', 'mixed');
  notEqual('nested', 'mixed');

});