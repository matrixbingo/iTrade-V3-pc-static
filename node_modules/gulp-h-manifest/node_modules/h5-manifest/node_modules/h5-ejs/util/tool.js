
// 验证是否为函数
function _isFunction(fn){
	return Object.prototype.toString.call(fn).indexOf("object Function") !== -1 ? true : false;
}
// 验证是否为对象
function _isObject(obj){
    return Object.prototype.toString.call(obj).indexOf("object Object") !== -1 ? true : false;
}
// 验证是否为对象
function _isString(obj){
    return Object.prototype.toString.call(obj).indexOf("object String") !== -1 ? true : false;
}
// 验证是否为数组
function _isArray(obj){
    return Object.prototype.toString.call(obj).indexOf("object Array") !== -1 ? true : false;
}

function _isInt(n){
	return n%1===0;
}

function _isFloat(n){
	return n%1!==0;
}



function _clone(obj){
	// 一般复制
    if (null == obj || "object" != typeof obj) return obj;

    // 处理 Date
    if (obj instanceof Date) {
        var copy =  Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // 处理 Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = _clone(obj[i]);
        }
        return copy;
    }
    // 处理 Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr]);
        }
        return copy;
    }
}

// 合并
function _mix(first,second,m){
    first = first || {};
    if(_isObject(first) && _isObject(second)){   
        for (var key in second) {
              if (!m) { //不像 for in operator, hasownproperty 不追踪prototype chain
                   if(first[key]){
                        if(_isObject(first[key])&&_isObject(second[key]))
                            _mix(first[key],second[key])
                        continue;
                   }
                   first[key] = second[key];
              }else{
                    first[key] = second[key];
              }
         }
    }
    return first;
}

// 继承
function _extend(first,second){
    if(_isObject(first) && _isObject(second)){   
        for (var key in second) {
            if(!first[key]){
                first[key] = second[key];
            }
         }
    }
    return first;
}


function _isRelative(path){
    return /^[\.\/]/.test(path);
}

// 生成数组
function _makeArray(obj){
	return !obj ? [] : _isArray(obj) ? obj : [obj];
}

module.exports = {
    // 复制
    clone:_clone,
    // 合并
    mix:_mix,
    // 是否为数字
    isString:_isString,
    // 是否为数组
    isArray:_isArray,
    // 是否为对象
    isObject:_isObject,
    // 是否为函数
    isFunction:_isFunction,
    // 生成数组
    makeArray:_makeArray,

    isInt: _isInt,

    isFloat: _isFloat,
    // 继承
    extend:_extend,
    // 相对路经
    isRelative:_isRelative
}
