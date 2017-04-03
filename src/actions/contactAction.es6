import {actionType} from '../constants/action-type.es6';
import {ajaxGet, ajaxPost, ajaxPut, ajaxDelete} from './utils.es6';
import {ajaxGetNoBar} from './commons.es6';

/**
 * 新增联系人
 */
export function addContact(contact) {
    return ajaxPost('/apollo/agent/contact', actionType.SAVE, contact);
}

/**
 * 根据Id获取公司所有联系人
 */
export function loadAllContactsbyId(corporationId) {
    return ajaxGet('/apollo/agent/contact/corporation/' + corporationId + '/contacts', actionType.LOADALLCONTACTSBYID);
}

/**
 * 更新联系人
 */
export function updateContact(corporation) {
    return ajaxPut('/apollo/agent/contact', actionType.LOADCONTACT, corporation);
}
