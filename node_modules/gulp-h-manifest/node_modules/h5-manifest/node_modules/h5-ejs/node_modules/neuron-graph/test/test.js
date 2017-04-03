'use strict';

/* global describe,it*/

var expect = require('chai').expect;
var graph = require('../');
var fixture = require('test-fixture')();
var jf = require('jsonfile');

var cases = {
  full: {
    types: [
      'devDependencies',
      'asyncDependencies',
      'dependencies',
      'engines'
    ],
    e: function (tree, e) {
      expect(tree).to.deep.equal(e);
    }
  },
  pro: {
    types: [
      'asyncDependencies',
      'dependencies',
      'engines'
    ],
    e: function (tree, e) {
      expect(tree).to.deep.equal(e);
    }
  },
  pro_no_engine: {
    tree: [
      'asyncDependencies',
      'dependencies'
    ],
    e: function (tree, e) {
      expect(tree).to.deep.equal(e);
    }
  }
};

var shrinkwrap = jf.readFileSync(fixture.resolve('shrink.json'));
var expected = require(fixture.resolve('expected'));
var pkg = {
  "name": "unit-m-customer",
  "version": "0.0.0"
};

Object.keys(cases).forEach(function (type) {
  var c = cases[type];
  describe(type, function(){
    it("graph()", function(){
      graph(pkg, {
        shrinkwrap: shrinkwrap,
        dependencyKeys: c.types
      }, function(err, t) {
        console.log(t);
      });
//      c.e(t, expected[type]);
    });
  });
});

