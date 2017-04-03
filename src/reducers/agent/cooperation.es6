import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';
import {DataUtil} from '../../utils/utils.es6'

export default {
    param: {
        //公司与组织的绑定关系 未合作 null
        cooperation: {
            "id": 0,
            "corporationId": 0,
            "orgId": 0,
            "parentOrgId": 0,
            "managerLoginId": 0,
            "managerName": "",
            "parentOrgName": ""
        },
        organization: {
            "organizationId": 0,
            "organizationName": ""
        },
        managerName: {}
    },
    stroes: {
        [actionType.LOADORGCORPORATIONBYID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                if (action.data.msg == null) {
                    action.data.cooperation = {
                        "id": 0,
                        "corporationId": 1,
                        "orgId": 0,
                        "parentOrgId": 0,
                        "managerLoginId": 0,
                        "managerName": "",
                        "parentOrgName": ""
                    },
                    action.data.organization = {
                        "organizationId": '',
                        "organizationName": ''
                    }
                    action.data.managerName = {
                        employeeName: '',
                        loginId: '',
                        ad: "",
                        organizationName: ""
                    }
                } else {
                    action.data.cooperation = action.data.msg;
                    action.data.organization = {
                        "organizationId": action.data.msg ? action.data.msg.parentOrgId : '',
                        "organizationName": action.data.msg ? action.data.msg.parentOrgName : ''
                    };
                    action.data.oOrganization = Object.assign({}, action.data.organization);
                    action.data.managerName = {
                        employeeName: action.data.msg ? action.data.msg.managerName : '',
                        loginId: action.data.msg ? action.data.msg.managerLoginId : '',
                        ad: "",
                        organizationName: action.data.msg ? action.data.msg.parentOrgName : ''
                    }
                    action.data.oManagerName = Object.assign({}, action.data.managerName); ;
                }
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};