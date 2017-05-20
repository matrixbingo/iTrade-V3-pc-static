import _ from "underscore";
import $ from "jquery";

/**
 * 对数据操作的公共方法
 */
export let DataUtil = DataUtil || {};
export let FormUtil = FormUtil || {};

export function merge(arr) {
    let rs = {};
    for (var i in arr) {
        rs = _.extend(rs, arr[i].param);
    }
    return rs;
};

export function stroes(arr) {
    let rs = {};
    for (var i in arr) {
        rs = _.extend(rs, arr[i].stroes);
    }
    return rs;
};

export function getValueBylinkedState(config, valueLink) {
    if (config == undefined || valueLink == undefined) {
        return '';
    }
    let val = '';
    let rs;
    try {
        if (valueLink.indexOf('.') > -1) {
            let keys = valueLink.split('.');
            for (var i in keys) {
                if (i == 0) {
                    rs = config.get(keys[i]);
                } else if (i > 0) {
                    rs = rs.get(keys[i]);
                }
            }
            val = rs;
        } else {
            val = config.get(valueLink);
        }
    } catch (e) {
        console.error('getValueBylinkedState', valueLink, rs, e);
    }

    return val;
}

export function trim(str) {
    if (str != null && typeof(str) != 'undefined' && str.length > 0) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    return str;
}

/**
 * 取的缓存中的数据
 */
export function getLocalStorageData(storageCode, defaultData) {
    if (localStorage) {
        var result = {};
        var data = localStorage.getItem(storageCode);
        if (data) {
            result = JSON.parse(data);
        } else {
            if (defaultData) {
                return defaultData;
            }
        }
        if (result) {
            return result;
        }
    }
    return null;
};

/**
 * 重新设置缓存中的数据
 * @param storageData
 */
export function setLocalStorageData(storageData, storageCode) {
    if (localStorage) {
        localStorage.removeItem(storageCode);
        localStorage.setItem(storageCode, JSON.stringify(storageData));
    }
};

export function getInputVal(_this, refKey) {
    const val = trim(findDOMNode(_this.refs[refKey]).querySelector('input').value);
    return val;
}

export function getUrls() {
    var aQuery = window.location.href.split("?");
    var aGET = {};
    if (aQuery.length > 1) {
        var aBuf = aQuery[1].split("&");
        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            var aTmp = aBuf[i].split("=");
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET;
};

export function initParams(data) {
    if (!data) {
        return '';
    }
    var arr = [];
    for (var item in data) {
        arr.push('&' + item + '=');
        arr.push(data[item]);
    }
    if (arr.length == 0) {
        return '';
    }
    var str = arr.join('');
    return '?' + str.substring(1, str.length);
};

export function getFirstTypeId(typeIds) {
    if (typeIds && typeIds.indexOf(',') == -1) {
        return typeIds
    } else {
        typeIds = typeIds.split(',');
        return typeIds[0];
    }
};

export function updateTable(table, item) {
    let rs = [];
    for (var i in table) {
        if (table[i].id == item.id) {
            rs.push(item);
        } else {
            rs.push(table[i]);
        }
    }
    return rs;
};

export function deteleTable(table, item) {
    let rs = [];
    for (var i in table) {
        if (table[i].id == item.id) {
            item.status = 0;
            rs.push(item);
        } else {
            rs.push(table[i]);
        }
    }
    return rs;
};

export function isInt(num) {
    var reg = /^[1-9]*[1-9][0-9]*$/;
    return reg.test(num);
}

export function getInt(val) {
    if (val == '0' || val == 0) {
        return val;
    }
    if (!isInt(val)) {
        val = getInt(val.substring(0, val.length - 1));
    }
    return val;
}

export function isFloat(num) {
    var reg = new RegExp('^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$'); //正浮点数
    if (reg.test(num)) {
        return true;
    }
    return false;
}

export function getFloat(val) {
    if (val == '0.' || val == 0) {
        return val;
    }
    if (!isFloat(val)) {
        val = getFloat(val.substring(0, val.length - 1));
    }
    return val;
}

export function getLength(val, length) {
    if (val && val.length > length) {
        return val.substring(0, length);
    }
    return val;
}

export function getItemByTypeId(data, key, typeId) {
    for (var i in data) {
        var item = data[i];
        if (item[key] == typeId) {
            return item
        }
        if (item && item.children && item.children.length > 0) {
            var _item = getItemByTypeId(item.children, key, typeId);
            if (_item != null) {
                return _item;
            }
        }
    }
    return null;
}

export function getUerByRef(_this, refName) {
    let data = _this.refs[refName] ? _this.refs[refName].formData : null;
    if (data && data.userId) {
        return data;
    }
    return '';
}

export function filterByKey(data, key) {
    let rs = [];
    for (var i in data) {
        rs.push(data[i][key]);
    }
    return rs;
}

export function difference(array, others) {
    return _.difference(array, others);
}

export function isEqual(object, other) {
    return _.isEqual(object, other);
}

export function union(object) {
    return _.sortBy(object, function (num) {
        return parseInt(num);
    });
}

export function arrToIntArr(object) {
    var rs = [];
    for (var i in object) {
        rs.push(parseInt(object[i]))
    }
    return rs;
}


export function isExis(arr, item) {
    return _.indexOf(arr, item) > -1;
}

export function checkTypeIds(typeIds, type_xuId, oTypeIds) {
    if (type_xuId != undefined && type_xuId != '' && typeIds.indexOf(',') > -1) {
        const arr = typeIds.split(',');
        if (arr.length == 2) {
            type_xuId = arr[1];
        } else {
            if (type_xuId == arr[0] && oTypeIds == typeIds) {
                type_xuId = '';
            } else if (type_xuId == arr[0] && oTypeIds != typeIds) {
                let _arr = oTypeIds.split(',');
                if (union(_arr).join(',') == union(arr).join(',')) {
                    type_xuId = '';
                } else {
                    _arr.shift();
                    if (_arr.join(',') == arr.join(',')) {
                        type_xuId = '';
                    } else {
                        type_xuId = arr[1];
                    }
                }
            }
        }
    } else {
        type_xuId = getFirstTypeId(typeIds);
    }
    return type_xuId;
}

export function getTimeStamp() {
    return new Date().getTime();
}

/**
 * 检测各种具体是对象类型
 */
DataUtil.is = {types: ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]}
for (var i = 0, c; c = DataUtil.is.types[i++];) {
    DataUtil.is[c] = (function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    })(c);
}

DataUtil.format = {
    /**
     *
     * @param num
     * @param precision
     * @param separator
     * @returns {*}
     *=======================================================
     *     formatNumber(10000)="10,000"
     *     formatNumber(10000, 2)="10,000.00"
     *     formatNumber(10000.123456, 2)="10,000.12"
     *     formatNumber(10000.123456, 2, ' ')="10 000.12"
     *     formatNumber(.123456, 2, ' ')="0.12"
     *     formatNumber(56., 2, ' ')="56.00"
     *     formatNumber(56., 0, ' ')="56"
     *     formatNumber('56.')="56"
     *     formatNumber('56.a')=NaN
     *=======================================================
     */
    currency: function (num, precision, separator) {
        var parts;
        // 判断是否为数字
        if (!isNaN(parseFloat(num)) && isFinite(num)) {
            // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
            // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
            // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
            // 的值变成了 12312312.123456713
            num = Number(num);
            // 处理小数点位数
            num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
            // 分离数字的小数部分和整数部分
            parts = num.split('.');
            // 整数部分加[separator]分隔, 借用一个著名的正则表达式
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

            return parts.join('.');
        }
        return '';
    }
}

DataUtil.isEqual = function (object, other) {
    let _object = {}, _other = {};
    if (DataUtil.is.Array(object)) {
        _object = [];
        _other = [];
    }
    Object.assign(_object, object);
    Object.assign(_other, other);
    return _.isEqual(DataUtil.jsonStr(_object), DataUtil.jsonStr(_other));
}

/**
 * data取子集json,如果data里没有使用json代替
 * @param json
 * @param data
 * @returns {{}}
 */
DataUtil.transfor = function (json, data) {
    let rs = {};
    let item;
    for (var key in json) {
        item = data[key];
        if (item || this.is.Boolean(item) || !DataUtil.validate.empty(item) || !DataUtil.validate.zero(item)) {
            rs[key] = item;
        } else {
            rs[key] = json[key];
            debugger;
            console.warn('transfor:', data, '不含有:' + key + '被替换');
        }
    }
    return rs;
}

DataUtil.cleanJson = function (json) {
    let rs = {};
    let item;
    for (var key in json) {
        item = json[key];
        if (DataUtil.is.String(item)) {
            rs[key] = '';
        } else {
            rs[key] = 0;
        }
    }
    return rs;
}

DataUtil.validate = {
    zero: function (str) {
        if (trim(str + '') == '0') {
            return false;
        }
        return true;
    },
    empty: function (str) {
        if (trim(str + '') == '') {
            return false;
        }
        return true;
        ;
    },
    required: function (str) {
        if (str == null || str == undefined || trim(str + '') == '') {
            return false;
        }
        return true;
    },
    boolean: function (str) {
        return DataUtil.is.Boolean(str);
    },
    /**
     * 身份证校验
     * @param str
     * @returns {boolean}
     */
    lgalIdCard: function (str) {
        if (str == undefined) {
            return false;
        }
        var idCardReg_15 = /^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$/;
        //^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$
        var idCardReg_18 = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

        return idCardReg_15.test($.trim(str.toLowerCase())) || idCardReg_18.test($.trim(str.toLowerCase()));
    },
    email: function (str) {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return reg.test(str);
    },
    /**
     * 手机号
     * @param str 仅校验11位
     * @returns {boolean}
     */
    mobile: function (str) {
        str = str + '';
        if(str && str.length == 11){
            return true;
        };
        return false;
        /*var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return reg.test(str);*/
    }/*,
    maxLength: function (str) {
        str = trim(str + '');
        if(str && str.length )
        return reg.test(str);
    }*/
}

DataUtil.jsonStr = function (data) {
    let item;
    for (let i in data) {
        item = data[i];
        if (DataUtil.is.Object(item) || DataUtil.is.Array(item)) {
            DataUtil.jsonStr(item);
        } else {
            data[i] = item + '';
        }
    }
    return data;
}

FormUtil.addClass = function (id, className) {
    var obj = $("#" + id);
    if (!obj.hasClass(className)) {
        obj.addClass(className);
    }
}

FormUtil.removeClass = function (id, className) {
    $("#" + id).removeClass(className);
}

FormUtil.setRootClass = function () {
    const maxWidth = 900;
    const minWidth = 320;
    let width = document.body.clientWidth;
    //console.log('width:'+width);
    this.addClass('root', 'rootmax');
    if (width < minWidth) {
        document.getElementById('root').style.width = minWidth + 'px';
    }
    if (width < maxWidth && width > minWidth) {
        document.getElementById('root').style.width = width + 'px';
    }
    if (width > maxWidth) {
        document.getElementById('root').style.width = maxWidth + 'px';
    }
}

FormUtil.getDialogWidth = function () {
    const maxWidth = 900;
    const minWidth = 320;
    let width = document.body.clientWidth;
    if (width <= minWidth) {
        return minWidth;
    }
    if (width < maxWidth && width > minWidth) {
        return width * 0.8;
    }
    if (width > maxWidth) {
        return maxWidth * 0.6;
    }
    return 600;
}

/**
 * 20170324 => 2017-03-24
 */
DataUtil.formatTime = function (time) {
    time = time + '';
    return time.substr(0,4) + '-' + time.substr(4,2) + '-' + time.substr(6,2);
}

DataUtil.getType = function(type) {
    switch (type) {
        case 1:
            return '小盘>9000';
        case 2 :
            return '中盘>9000';
        case 3 :
            return '小盘1000~9000';
        case 4 :
            return '中盘3000~9000';
    }
}

FormUtil.getStockUrl = function(code){
    return 'http://stockhtm.finance.qq.com/sstock/ggcx/' + code  + '.shtml';
}