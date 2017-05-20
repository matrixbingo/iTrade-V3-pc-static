import {actionType} from '../constants/action-type.es6';
import {ajaxGet, ajaxPost, ajaxPut, ajaxDelete} from './utils.es6';
import {ajaxGetNoBar} from './commons.es6';

/**
 * 模糊搜索公司信息
 */
export function loadTradeList(param) {
    return ajaxGet(actionType.BASE_URL + '/trade/search', actionType.LOADTRADELIST, param);
}



