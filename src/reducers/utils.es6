import Immutable from 'immutable';
import {actionType} from '../constants/action-type.es6';

export default {
    param: {
        dialogConfig:{
            show:false,
            type:'success',
            content:'评价已提交'
        }
    },
    stroes: {
        [actionType.SETDIALOG]: (data, action) => {
            action.dialogConfig = action.cfg;
            delete action.cfg;
            return data.merge(Immutable.fromJS(action));

        }
    }
};