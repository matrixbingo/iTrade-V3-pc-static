# shrinked [![NPM version](https://badge.fury.io/js/shrinked.svg)](http://badge.fury.io/js/shrinked) [![Build Status](https://travis-ci.org/kaelzhang/node-shrinked.svg?branch=master)](https://travis-ci.org/kaelzhang/node-shrinked) [![Dependency Status](https://gemnasium.com/kaelzhang/node-shrinked.svg)](https://gemnasium.com/kaelzhang/node-shrinked)

Parses the shrinkwrap.json and returns the B+ tree of the dependencies.

```js
<name>: {
  <version>: {
    dependencies: {
      <dep-name>: {
        <dep-range>: <dep-version>
      }
    },
    
    asyncDependencies: ...,
    devDependencies: ...
  }
}
```

## Install

```bash
$ npm install shrinked --save
```

## Usage

```js
var shrinked = require('shrinked');
```

### shrinked(file, [options], callback)

- file `path` Absolute path of the xxx-shrinkwrap.json
- callback `function(err, tree)`
- err `Error`
- tree `Object` the B+ tree of dependencies which described above. 
- options `Object`
  - dependencyKeys `Array=['dependencies']` into which dependency key should `shrinked` decende down.

```js
shrinked('cortex-shrinkwrap.json', {
  dependencyKeys: [
    'dependencies',
    // Then `shrinked` will parse three more keys in addition.
    'asyncDependencies',
    'devDependencies',
    'engines'
  ]
}, function(err, tree){
  if (err) {
    return console.error(err);
  }
  console.log('The B+ tree is', util.inspect(tree, depth: 10));
});
```

### shrinked.parse(json, [options])

- json `Object` the object of shrinkwrap.json

Returns `tree`


## License

MIT