import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        allCities:[]
    },
    stroes: {
        [actionType.LOADALLPROVINCESCITIES]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.allCities = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};