[![NPM version](https://badge.fury.io/js/neuron-pkg.svg)](http://badge.fury.io/js/neuron-pkg)
[![Build Status](https://travis-ci.org/kaelzhang/neuron-pkg.svg?branch=master)](https://travis-ci.org/kaelzhang/neuron-pkg)
[![Dependency Status](https://gemnasium.com/kaelzhang/neuron-pkg.svg)](https://gemnasium.com/kaelzhang/neuron-pkg)

# neuron-pkg

Parses neuron package id into name, version and path.

## Install

```bash
$ npm install neuron-pkg --save
```

## Usage

```js
var pkg = require('neuron-pkg');

pkg('a@~1.3.0/abc');
// -> {
//   name: 'a',
//   version: undefined
//   range: '~1.3.0',
//   path: '/abc'
// }

pkg('a@1.2.3');
// -> {
//   name: 'a',
//   version: '1.2.3',
//   range: undefined,
//   path: ''
// }
```

## pkg(id)

- id `String`

Returns `Object` the parsed object.

### pkg.format(obj)

- obj `Object` 

The reverse method of `pkg(id)`

Returns `String` the formated id.

## License

MIT