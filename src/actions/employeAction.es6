import {actionType} from '../constants/action-type.es6';
import {ajaxGet, ajaxPost, ajaxPut, ajaxDelete} from './utils.es6';
import {ajaxGetNoBar, ajaxPostNoBar} from './commons.es6';

/**
 * 获取公司下的所有用户
 */
export function loadAllEmployesbyId(corporationId) {
    return ajaxGetNoBar('/apollo/agent/user/corporation/' + corporationId + '/users', actionType.LOADALLEMPLOYESBYID);
}

/**
 * 根据loginId查询用户信息
 */
export function loadEmployebyLoginId(loginId, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/user/' + loginId, actionType.LOADEMPLOYEBYLOGINID, {}, _this, callback);
}

/**
 * 根据loginId查询用户信息 轮询
 */
export function loadEmployebyLoginIdInterval(loginId, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/user/' + loginId, actionType.QUERY, {}, _this, callback);
}

/**
 * 新增用户
 */
export function addEmploye(corporationId, employe, _this, callback) {
    return ajaxPostNoBar('/apollo/agent/user/corporation/' + corporationId, actionType.UPDATE, employe, _this, callback);
}

/**
 * 更新用户
 */
export function updateEmploye(corporationId, employe, _this, callback) {
    return ajaxPut('/apollo/agent/user/corporation/' + corporationId, actionType.UPDATEEMPLOYE, employe, _this, callback);
}

/**
 * 将用户设置为已离职
 */

export function deleteEmployee(userId, _this, callback) {
    return ajaxPut('/apollo/agent/user/' + userId + '/terminate','','', _this, callback);
}

