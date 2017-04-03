import {actionType} from '../constants/action-type.es6';
import {ajaxGetNoBar} from './commons.es6';

/**
 * 获取所有省份和城市
 */
export function loadAllProvincesCities() {
    return ajaxGetNoBar('/apollo/agent/public/province/provinces/cities', actionType.LOADALLPROVINCESCITIES);
}
