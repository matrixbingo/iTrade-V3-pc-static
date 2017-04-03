import {actionType} from '../constants/action-type.es6';
import {fetch} from 'eg-tools';
import {initParams} from '../utils/utils.es6';


function setDialog(cfg) {
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

function checksRsult(data) {
    if (data.code && data.code == 200) {
        setDialog({
            show: true,
            type: 'success',
            content: '操作成功',
            showTime: 2000
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

function checksStatus(data) {
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

function checkCode(data) {
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

export function ajaxGetNoBar(url, type, data, _this, callBack) {
    return dispatch=> {
        fetch(url + initParams(data), {}, function (data) {
            if (checkCode(data)) {
                const _data = {
                    code: data.code,
                    msg: data.msg
                }
                if (data.code && data.code == 200) {
                    _this && callBack && callBack(_this, _data);
                }
                dispatch({
                    type: type,
                    data: data
                });
            } else {
                checksStatus(data);
                console.error(url + ' error!!');
            }
        }, '', {isLoadingBar: false});
    }
};

export function ajaxPostNoBar(url, type, data, _this, callBack) {
    return dispatch=> {
        fetch(url, JSON.stringify(data), function (data) {
                const _data = {
                    code: data.code,
                    msg: data.msg
                }
                if (data.code && data.code == 200) {
                    _this && callBack && callBack(_this, _data);
                }
                if (checkCode(data)) {
                    dispatch({
                        type: type,
                        data: data
                    });
                } else {
                    checksStatus(data);
                    console.error(url + ' error!!');
                }
            },
            function (err) {
            },
            {
                method: "post",
                header: {
                    'Content-Type': 'application/json'
                },
                isLoadingBar: false
            }
        )
    };
};