import {actionType} from '../constants/action-type.es6';
import {ajaxGet, ajaxPost, ajaxPut, ajaxDelete} from './utils.es6';
import {ajaxGetNoBar} from './commons.es6';
import {initParams} from '../utils/utils.es6';

/**
 * 根据手机号查询公司是否存在
 */
export function loadCorporationByMobileExist(mobile, _this, callback) {
    return ajaxGet('/apollo/agent/public/corporation/contact/mobile/' + mobile + '/exist', actionType.QUERY, {}, _this, callback);
}

/**
 * 根据手机号查询公司合作状态
 */
export function loadApproveStatusByMobile(mobile, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/public/corporation/contact/mobile/' + mobile + '/approve/status', actionType.LOADCORPORATIONBYMOBILE, {}, _this, callback);
}

/**
 * 根据公司名称查询公司
 */
export function loadCorporationByCorporationName(name, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/public/corporation/name/exist?name=' + name, actionType.LOADCORPORATIONBYCORPORATIONNAME, {}, _this, callback);
}

/**
 * 获取省份列表
 */
export function loadProvinceList() {
    return ajaxGetNoBar('/apollo/agent/public/province/provinces', actionType.LOADPROVINCELIST);
}

/**
 * 根据省份ID获取城市列表
 */
export function loadCityListByProvinceId(provinceId) {
    return ajaxGetNoBar('/apollo/agent/public/city/province/' + provinceId + '/cities', actionType.LOADCITYLISTBYPROVINCEID);
}

/**
 * 发送注册代理商验证码
 */
export function sendSmsVerifyCode(mobile) {
    return ajaxGetNoBar('/apollo/agent/public/sms/corporation?mobile=' + mobile, actionType.LOADSMSCODE);
}

/**
 * 注册代理商验证码验证
 */
export function checkSmsCode(data, _this, callback) {
    return ajaxPost('/apollo/agent/sms/corporation?mobile=' + data.mobile + '&code=' + data.code, actionType.CHECKSMSCODE, data, _this, callback);
}

/**
 * 注册公司
 */
export function addCorporation(corporation, contact, smsCode, _this, callback) {
    const corporationInfo = {
        "corporation": corporation,
        "corporationContacts": [contact],
        "smsCode": smsCode
    }
    return ajaxPost('/apollo/agent/public/corporation/', actionType.SAVE, corporationInfo, _this, callback);
}

/**
 * 模糊搜索公司信息
 */
export function loadCorporationList(param) {
    return ajaxGet('/apollo/agent/corporation/search', actionType.LOADCORPORATIONLIST, param);
}

/**
 * 根据Id获取公司
 */
export function loadCorporationbyId(corporationId, _this, callback) {
    return ajaxGet('/apollo/agent/corporation/' + corporationId, actionType.LOADCORPORATIONBYID, {}, _this, callback);
}

/**
 * 更新公司
 */
export function updateCorporation(corporation, _this, callback) {
    return ajaxPut('/apollo/agent/corporation', actionType.LOADCORPORATIONBYID, corporation, _this, callback);
}

/**
 * 更新公司审核状态
 */
export function updateCorporationApproveStatus(approveStatus, _this, callback) {
    return ajaxPut('/apollo/agent/corporation/' + approveStatus.corporationId + '/approve/status/' + approveStatus.status + '?approveRemark=' + approveStatus.approveRemark, actionType.UPDATECORPORATIONAPPROVESTATUS, {}, _this, callback);
}

/**
 * 通过公司Id获取公司与组织的绑定关系
 */
export function loadOrgCorporationbyId(corporationId, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/org/corporation/' + corporationId, actionType.LOADORGCORPORATIONBYID, {}, _this, callback);
}

/**
 * 通过公司Id获取公司与组织的绑定关系 轮询
 */
export function loadOrgCorporationbyIdInterval(corporationId, _this, callback) {
    return ajaxGetNoBar('/apollo/agent/org/corporation/' + corporationId, actionType.QUERY, {}, _this, callback);
}

/**
 * 新增公司与组织的绑定关系
 */
export function addCorporationCoorporation(corporationId, parentOrgId, managerLoginId, _this, callback) {
    return ajaxPost('/apollo/agent/org/corporation/' + corporationId + '?parentOrgId=' + parentOrgId + '&managerLoginId=' + managerLoginId, actionType.ADDCORPORATIONCOORPORATION, {}, _this, callback);
}

/**
 * 更新公司与组织的绑定关系
 */
export function updateCorporationCoorporation(corporationId, parentOrgId, managerLoginId, _this, callback) {
    return ajaxPut('/apollo/agent/org/corporation/' + corporationId + '?parentOrgId=' + parentOrgId + '&managerLoginId=' + managerLoginId, actionType.ADDCORPORATIONCOORPORATION, {}, _this, callback);
}

export function deleteCorporationOrg(corporationId, _this, callback) {
    return ajaxPut('/apollo/agent/org/corporation/' + corporationId + '/terminate', '', '', _this, callback);
}

/**
 * 导出详情
 */
export function downloadExcel(data){
    if (data) {
        if (!data.approveStatus) {
            data.approveStatus = -1;
        }

        if (!data.cooperationStatus) {
            data.cooperationStatus = -1;
        }
    }
    const url = '/agent/download/excel'  + initParams(data);
    const pathName = window.location.pathname.substring(1);
    const webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    const finalUrl = window.location.protocol + '//' + window.location.host + '/' + webName + url;
    window.open(finalUrl);
}


