'use strict';

/* global describe, it */

var assert = require('chai').assert;
var graph = require('../');


describe('graph generator', function() {

  it('all', function() {
    var mixed = readJSON('mixed');
    mixed.version = "0.1.1";
    var config = graph([mixed, readJSON('cycle')], {
      compress: false
    });


    assertLength(config, 13);
    assert.equal(getRootNode(config).length, 2);
    assertTimes(config, "a@1.0.0", 2);
    assertTimes(config, "b@1.0.0", 1);
    assertTimes(config, "b@1.0.1", 1);
    assertTimes(config, "cycle@1.0.0", 1);
    assertTimes(config, "c@1.0.0", 1);
    assertTimes(config, "d@1.0.0", 1);
    assertTimes(config, "e@1.0.0", 1);
    assertTimes(config, "f@1.0.0", 1);

    assert.equal(Object.keys(config._).length, 2);
  });

  it('mixed', function() {
    var tree = readJSON('mixed');
    var config = graph(tree, {
      compress: false
    });

    assertLength(config, 12);
    assert.equal(getRootNode(config).length, 2);
    assertTimes(config, "a@1.0.0", 2);
    assertTimes(config, "b@1.0.0", 1);
    assertTimes(config, "b@1.0.1", 1);

  });

  it('ab', function() {
    var tree = readJSON('ab');
    var config = graph(tree);

    assertLength(config, 3);
    assert.equal(getRootNode(config).length, 2);
    assertUniq(config);
  });



  it('cycle', function() {
    var tree = readJSON('cycle');
    var config = graph(tree);
    assertLength(config, 9);
    assert.equal(getRootNode(config).length, 2);
    assertUniq(config);
  });



  it('simple', function() {
    var tree = readJSON('simple');
    var config = graph(tree, {
      compress: false
    });

    assert.equal(getRootNode(config).length, 1);
    assert(config[0] && config[0].length == 1);
    assert.equal(config[0][0], 'test-pkg@0.1.0');
  });


  it('nodev', function() {
    var tree = readJSON('nodev');
    var config = graph(tree, {
      compress: false
    });

    assert(config[0] && config[0].length == 2);
    assert.equal(config[0][0], 'test-pkg@0.1.0');
    assert.equal(config[0][1]['type-detect@~0.1.0'], 1);
    assert(config[1] && config[1].length == 1);
    assert(config[1][0], 'type-detect@0.1.3-beta');
  });


  it('nested', function() {
    var tree = readJSON('nested');
    var config = graph(tree, {
      compress: false
    });

    assertLength(config, 5);
    assert.equal(getRootNode(config).length, 2);

    assertTimes(config, "json@1.0.1", 1);
    assertTimes(config, "util@1.0.4", 1);
    assertTimes(config, "util@1.0.5", 1);

  });



  it('async', function() {
    var tree = readJSON('async');
    var config = graph(tree, {
      compress: false
    });

    assertLength(config, 6);
    assert.equal(getRootNode(config).length, 2);

    assertTimes(config, "json@1.0.1", 1);
    assertTimes(config, "json@1.0.2", 1);
    assertTimes(config, "util@1.0.4", 2);

  });

  it('branch', function() {
    var tree = readJSON('branch');
    var config = graph(tree, {
      compress: false
    });

    assertLength(config, 6);
    assertTimes(config, "json@1.0.1", 1);
    assertTimes(config, "json@1.0.2", 1);
    assertTimes(config, "util@1.0.4", 2);

  });

  it('self', function() {
    var tree = readJSON('self');
    var config = graph(tree, {
      compress: false
    });

    assertLength(config, 1);
    assert.equal(getRootNode(config).length, 2);
    assertTimes(config, "test-pkg@0.1.0", 1);
    assert(config[0] && config[0].length == 2);
    assert.equal(config[0][1]['test-pkg@~0.1.0'], 0);
  });

  function assertLength(config, length) {
    assert(!config[length], "Position [" + length + "] should be empty");
    assert.equal(Object.keys(config).length, length + 1, "length exceed");
    while (length > 0) {
      assert(config[--length], "Position [" + length + "] is empty");
    }
  }


  function assertUniq(config) {
    var keys = Object.keys(config);

    var rs = {};
    keys.forEach(function(i) {
      if (i != '_')
        rs[keys[i][0]] = true;
    });

    assert.equal(keys.length - 1, Object.keys(rs).length, "config has uniq 'name@version' piars");
  }

  function assertTimes(config, key, times) {
    var cnt = 0;
    Object.keys(config).forEach(function(i) {
      if (config[i][0] == key) cnt++;

    });
    assert.equal(cnt, times, key + " must show " + times + " in config, acturaly shows: " + cnt);
  }

  function readJSON(name) {
    return JSON.parse(JSON.stringify(require('./fixtures/' + name)));
  }


  function getRootNode(config) {
    var idx;
    for(var p in config._) {
      if(idx !== undefined) break;
      idx = config._[p];
    }

    return config[idx];
  }

});
