# gen-graph [![NPM version](https://badge.fury.io/js/gen-graph.svg)](http://badge.fury.io/js/gen-graph) [![Build Status](https://travis-ci.org/villadora/gen-graph.svg?branch=master)](https://travis-ci.org/villadora/gen-graph) [![Dependency Status](https://gemnasium.com/villadora/gen-graph.svg)](https://gemnasium.com/villadora/gen-graph)


## Install

```bash
$ npm install gen-graph --save
```

## Usage

```js
var graph = require('gen-graph');


var conf = graph(shrinkwrap_json, options);

conf = graph(shrinkwrap);

conf = graph([shrinkwrap1, shrinkwrap2], {
  edge_keys:['dependencies', 'asyncDependencies', 'devDependencies']
});
```

Generated object will contains '_' property with the root tree's name and version.

```js
var conf = graph({ name: "json", version: "1.0.0"});

// compressed conf will be
{
  0: [ 1.0.0" ],
  _: {
      "json@1.0.0": 0
  }
}

conf = graph({ name: "json", version: "1.0.0"}, { compress: false});

// uncompressed conf will be
{
  0: [ "json@1.0.0" ],
  _: {
      "json@1.0.0": 0
  }
}
```

So root node can be located fast.

## Options

### edge_keys {Array=}

Keys will be traveled as edges in graph, like 'devDependencies'. Default is ['dependencies', 'asyncDependencies']

### compress {boolean=}

Whether output name in the graph node. Default is `true`.

## Licence

MIT
