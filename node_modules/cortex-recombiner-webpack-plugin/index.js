/**
 * Created by madlord on 16/5/4.
 */
var colors = require('colors');
var path=require('path');
var recombiner = require('cortex-recombiner');

var _opt={};
function recombine () {
    recombiner({
        base:_opt.base|| __dirname,//项目根目录
        noBeta: !!_opt.noBeta//忽略neurons文件夹下beta版本的cortex包，如果开启此项功能，则必须保证neurons下所有的包都含有非beta版本
    });
    console.log("cortex recombination complete".green);
}

function CortexRecombinerPlugin(options) {
    _opt=options
}

CortexRecombinerPlugin.prototype.apply = function(compiler) {

    recombine();
    compiler.plugin("after-environment", function() {
        compiler.watchFileSystem = new IgnoringWatchFileSystem(compiler.watchFileSystem,[path.resolve(_opt.base,"./node_modules/@cortex/")] );
    }.bind(this));
};

function IgnoringWatchFileSystem(wfs, paths) {
    this.wfs = wfs;
    this.paths = paths;
}

IgnoringWatchFileSystem.prototype.watch = function(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
    var ignored = function(path) {
        return this.paths.some(function(p) {
            return p instanceof RegExp ? p.test(path) : path.indexOf(p) === 0;
        });
    }.bind(this);

    var notIgnored = function(path) {
        return !ignored(path);
    };

    var ignoredFiles = files.filter(ignored);
    var ignoredDirs = dirs.filter(ignored);

    this.wfs.watch(files.filter(notIgnored), dirs.filter(notIgnored), missing, startTime, options, function(err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) {
        if(err) return callback(err);

        ignoredFiles.forEach(function(path) {
            fileTimestamps[path] = 1;
        });

        ignoredDirs.forEach(function(path) {
            dirTimestamps[path] = 1;
        });

        recombine();

        callback(err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
    }, callbackUndelayed);
};

module.exports = CortexRecombinerPlugin;


