'use strict';

var expect = require('chai').expect;
var pkg = require('../');

var cases = [
  {
    id: 'a',
    obj: {
      name: 'a',
      version: undefined,
      range: undefined,
      path: ''
    }
  },
  {
    id: 'a@1.1.0',
    obj: {
      name: 'a',
      version: '1.1.0',
      range: undefined,
      path: ''
    }
  },
  {
    id: 'a@1.1.0/a',
    obj: {
      name: 'a',
      version: '1.1.0',
      range: undefined,
      path: '/a'
    }
  },
  {
    id: 'a@~1.1.0/a',
    obj: {
      name: 'a',
      range: '~1.1.0',
      version: undefined,
      path: '/a'
    }
  },
  {
    id: 'a/a',
    obj: {
      name: 'a',
      range: undefined,
      version: undefined,
      path: '/a'
    }
  },
  {
    id: 'a@hahah/a',
    obj: {
      name: 'a',
      range: 'hahah',
      version: undefined,
      path: '/a'
    }
  }
];

cases.forEach(function (c) {
  describe(c.id, function(){
    it("pkg(id)", function(){
      expect(pkg(c.id)).to.deep.equal(c.obj);
    });

    it("pkg.format(obj)", function(){
      expect(pkg.format(c.obj)).to.equal(c.id);
    });
  });
});

describe("error", function(){
  it("should throw error if id is not a string", function(){
    var error;
    try {
      pkg();
    } catch(e) {
      error = e;
    }

    expect(error).not.to.equal();
  });
});
