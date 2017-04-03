import {actionType} from '../constants/action-type.es6';
import {promisefetch as fetch} from 'eg-tools';
import {initParams} from '../utils/utils.es6';

export function baseurl(){
    return actionType.BASE_URL;
}
export function setDialog(cfg) {
    return dispatch=> {
        let {showTime,...others}=cfg;
        dispatch({
            type: actionType.SETDIALOG,
            cfg: others
        });
        if (showTime) {
            others.show = false;
            setTimeout(function () {
                dispatch({
                    type: actionType.SETDIALOG,
                    cfg: others
                });
            }, showTime);
        }
    };
};

export function checksRsult(data) {
    if (data.code && data.code == 200) {
        setDialog({
            show: true,
            type: 'success',
            content: '操作成功',
            showTime: 3000
        })(dispatch);
        //window.window.location.reload();
    } else if (data.code && data.code == 500) {
        setDialog({
            show: true,
            type: 'error',
            content: data.msg,
            showTime: 3000
        })(dispatch);
    } else if (typeof(data) == "string") {
        data = JSON.parse(data);
        if (data.code && data.code == 500) {
            setDialog({
                show: true,
                type: 'error',
                content: data.msg,
                showTime: 3000
            })(dispatch);
        }
    }
}

export function checksStatus(data) {
    if (typeof(data) == 'object' && data.status != 200 && data.status != 500) {
        setDialog({
            show: true,
            type: 'error',
            content: '网络链接不给力，请稍后重试',
            showTime: 3000
        })(dispatch);
    }
    if (data.status && data.status == 500) {
        setDialog({
            show: true,
            type: 'error',
            content: '服务器不给力，请稍后重试',
            showTime: 3000
        })(dispatch);
    }
};

export function checkCode(data) {
    try {
        if (typeof(data) == "string") {
            data = JSON.parse(data);
        }
    } catch (e) {
        console.error('checkCode:', e);
    }
    if (typeof(data) == 'object' && data.code != 200) {
        setDialog({
            show: true,
            type: 'error',
            content: data.msg,
            showTime: 3000
        })(dispatch);
        return false;
    }
    return true;
};

export function ajaxGet(url, type, data, _this, callBack) {
    return dispatch=> {
        fetch(url + initParams(data), {
            method: "GET",
            timeout: 60000
        }).then((data)=> {
            if (checkCode(data)) {
                const _data = {
                    code:data.code,
                    msg:data.msg
                }
                if (data.code && data.code == 200) {
                    _this && callBack && callBack(_this, _data);
                }
                dispatch({
                    type: type,
                    data: data
                });
            }
        }, (error)=> {
            checksStatus(error);
            console.error(url + ' error!!');
        });
    }
}

export function ajaxPost(url, type, data, _this, callBack){
    return dispatch=> {
        fetch(url, {
            body:JSON.stringify(data),
            method: "POST",
            timeout: 60000,
            header: {
                'Content-Type': 'application/json'
            }
        }).then((data)=> {
            checksRsult(data);
            if (data.code && data.code == 200) {
                const _data = {
                    code:data.code,
                    msg:data.msg
                }
                _this && callBack && callBack(_this, _data);
            }
            dispatch({
                type: type,
                data: data
            });

        }, (data)=> {
            checksStatus(data);
            console.error(url + ' error!!!');
        });
    }
}

export function ajaxPut(url, type, data, _this, callBack){
    return dispatch=> {
        fetch(url, {
            body:JSON.stringify(data),
            method: "PUT",
            timeout: 60000,
            header: {
                'Content-Type': 'application/json'
            }
        }).then((data)=> {
            checksRsult(data);
            const _data = {
                code:data.code,
                msg:data.msg
            }
            if (data.code && data.code == 200) {
                _this && callBack && callBack(_this, _data);
            }
            dispatch({
                type: type,
                data: data
            });
        }, (data)=> {
            checksStatus(data);
            console.error(url + ' error!!!');
        });
    }
}

export function ajaxDelete(url, type, data, _this, callBack){
    return dispatch=> {
        fetch(url, {
            body:JSON.stringify(data),
            method: "DELETE",
            timeout: 30000,
            header: {
                'Content-Type': 'application/json'
            }
        }).then((data)=> {
            checksRsult(data);
            const _data = {
                code:data.code,
                msg:data.msg
            }
            if (data.code && data.code == 200) {
                _this && callBack && callBack(_this, _data);
            }
            dispatch({
                type: type,
                data: data
            });
        }, (data)=> {
            checksStatus(data);
            console.error(url + ' error!!!');
        });
    }
}