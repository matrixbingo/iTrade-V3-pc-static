'use strict';

var expect = require('chai').expect;
var shrinked = require('../');
var jf = require('jsonfile');
var node_path = require('path');
var file = node_path.join(__dirname, 'fixtures', 'shrinkwrap.json');
var expected_file = node_path.join(__dirname, 'expected', 'tree.js'); 
var shrinkwrap = jf.readFileSync(file);
var expected = require(expected_file);

[['dependencies'], ['dependencies', 'asyncDependencies']].forEach(function (keys, index) {
  describe(JSON.stringify(keys), function(){
    it("shrinked.parse(json, options)", function(){
      var tree = shrinked.parse(shrinkwrap, {
        dependencyKeys: keys
      });
      expect(tree).to.deep.equal(expected[index]);
    });

    index === 0 && it("shrinked.parse(json)", function(){
      var tree = shrinked.parse(shrinkwrap);
      expect(tree).to.deep.equal(expected[index]);
    });

    it("shrinked(file, options, callback)", function(done){
      shrinked(file, {
        dependencyKeys: keys
      }, function (err, tree) {
        expect(err).to.equal(null);
        expect(tree).to.deep.equal(expected[index]);
        done();
      });
    });

    index === 0 && it("shrinked(file, callback)", function(done){
      shrinked(file, function (err, tree) {
        expect(err).to.equal(null);
        expect(tree).to.deep.equal(expected[index]);
        done()
      });
    });
  });
});
