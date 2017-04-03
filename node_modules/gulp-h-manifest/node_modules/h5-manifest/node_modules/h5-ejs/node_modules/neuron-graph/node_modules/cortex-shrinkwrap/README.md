# Cortex Shrinkwrap

 [![NPM version](https://badge.fury.io/js/cortex-shrinkwrap.png)](http://badge.fury.io/js/cortex-shrinkwrap) [![Build Status](https://travis-ci.org/cortexjs/cortex-shrinkwrap.png)](https://travis-ci.org/cortexjs/cortex-shrinkwrap)


This command will lock down the versions of a package's dependencies and generate a `cortex-shrinkwrap.json` file in your package directory.

## Install 

``` bash
npm install cortex-shrinkwrap -g
```

## API

Also this lib can be used in nodejs.

```javascript
var shrinkwrap = require('cortex-shrinkwrap');

var traveller = shrinkwrap(pkg, built_root, options, function(err, shrinked) {
    // console.log(shrinked);
});

traveller.on('ignoreDev', function(pkgName) {
  
});

traveller.on('ignoreAsync', function(pkgName) {
  
});



```

### shrinkwrap(pkg, built_root, [options], callback): Traveller

Generate shrinkwrap.json from pkg, return a Traveller object, see [cortex-deps-traveller](http://github.com/cortexjs/cortex-deps-traveller) for more details;

#### pkg

Pakcage information stored in cortex.json.

#### built_root(=require=): path of directory where cortex packages will be built to

#### Options

* dev: whehter include `devDependencies`
* async: whether incldue `asyncDependencies`
* stableOnly: only include stable version in shrinkwrap, default value is =false=


#### callback(err, shrinkedJson)


### shrinktree((name, range)|pkg, [options], callback)

Generate a simple deps tree with information of shrinkwrap.json

```javascript

var shrinktree = require('cortex-shrinkwrap').shrinktree

shrinktree('deep-eql', "~0.1.0", built_root,  function(err, tree) {
  
});

// or provide a package json if already have one

shrinktree({
  name: 'deep-eql',
  version: '0.1.0',
  dependencies: {
     'type-detect': "~1.0.0"
  }
}, built_root, {
  enableDev: true
}, function(err, tree) {

});

```

#### name

Package name of the tree root

#### range 

Range of the tree root

#### pkg

Package json as the root

#### Options

The same as options in shrinkwrap

## License

(The MIT License)

    Copyright (c) 2014, Villa.Gao <jky239@gmail.com>;
    All rights reserved.
