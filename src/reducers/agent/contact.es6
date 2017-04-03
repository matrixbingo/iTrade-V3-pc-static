import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        contact: {
            "contactId": 0,
            "corporationId": 0,
            "contactName": "",
            "contactEmail": "",
            "contactMobile": "",
            "creator": ""
        },
        contactList: []
    },
    stroes: {
        [actionType.LOADALLCONTACTSBYID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.contactList = action.data.msg;
                if (action.data.msg && action.data.msg.length > 0) {
                    action.data.contact = action.data.msg[0];
                    action.data.oContact = action.data.msg[0];
                }
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.LOADCONTACT]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.contact = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};