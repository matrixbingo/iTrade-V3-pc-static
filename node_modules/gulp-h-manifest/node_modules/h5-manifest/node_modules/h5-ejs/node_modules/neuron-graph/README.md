# neuron-graph [![NPM version](https://badge.fury.io/js/neuron-graph.svg)](http://badge.fury.io/js/neuron-graph) [![Build Status](https://travis-ci.org/cortexjs/neuron-graph.svg?branch=master)](https://travis-ci.org/cortexjs/neuron-graph) [![Dependency Status](https://gemnasium.com/cortexjs/neuron-graph.svg)](https://gemnasium.com/cortexjs/neuron-graph)

Generate neuron config graph from package/shrinkwrap.

## Install

```bash
$ npm install neuron-graph --save
```

## Usage

```js
var graph = require('neuron-graph');

graph(pkg, {
   shrinkwrap: shrinkwrap_object_if_already_have_one,
   dependencyKeys: ['dependencies', 'asyncDependencies']
}, function(err, g) {

});
```


## Options


### cwd {string=}

Current work directory for search 'cortex-shrinkwrap.json'.

### built_root {string}

Directory where to find installed packages.

### shrinkwrap {Object=}

Shrinkwrap object

### dependencyKeys {Array.<String>=}

Dependencies will parse during the processing. Default is ['dependencies', 'asyncDependencies']

### stable_only {boolean=}

Pass to cortex-shrinkwrap. Default is `false`.

### ignore_shrink_file {boolean=}

Always regenerate shrinkwrap object even `cortex-shrinkwrap.json` exists. Default is `false`.

## Licence

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->
