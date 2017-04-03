import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        employeSearchData: {
            loginId: 0,
            name: '',
            phone: '',
            status: 0
        },
        employeEditorPage: {
            editorType: 0 //0：新增 1：更新
        },
        employeList: {
            "list": [
                {
                    "employeeName": "孝杰公司沙比",
                    "loginName": "121212",
                    "reportToEmployeeName": '汇报人',
                    "sfz": 1,
                    "locationName": "上海",
                    "mobileNo": 10000000000000,
                    "status": 1
                },
                {
                    "employeeName": "孝杰公司沙比",
                    "loginName": "121212",
                    "reportToEmployeeName": '汇报人',
                    "sfz": 1,
                    "locationName": "上海",
                    "mobileNo": 10000000000000,
                    "status": 1
                }
            ],
            "totalCount": 20,
            "page": 1,
            "pageSize": 10
        },
        employeListAll: [],
        employee: {
            "loginId": 0,
            "orgId": 0,
            "reportLoginId": 0,
            "reportEmployeeName": "",
            "name": "",
            "ad": "",
            "gender": 2,
            "cityId": 3,
            "idCard": "",
            "email": "",
            "mobile": "",
            "creator": 0,
            "provinceId": 0,
            "cityName": ""
        },

        leaveEmployeeId: 0,

        employeeEnditorPage: {
            reportEmploye: {
                "employeeName": "",
                "ad": "",
                "loginId": 0,
                "organizationName": ""
            }
        }
    },
    stroes: {
        [actionType.LOADALLEMPLOYESBYID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.employeListAll = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.LOADEMPLOYEBYLOGINID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                if (action.data.msg == null) {
                    action.data.msg = {
                        "loginId": 0,
                        "orgId": 0,
                        "reportLoginId": 0,
                        "reportEmployeeName": "",
                        "name": "",
                        "ad": "",
                        "gender": 2,
                        "cityId": 3,
                        "idCard": "",
                        "email": "",
                        "mobile": "",
                        "creator": 0,
                        "provinceId": 0,
                        "cityName": ""
                    };
                }else{
                    action.data.managerName = {
                        employeeName: action.data.msg.reportEmployeeName,
                        loginId: action.data.msg.reportLoginId,
                        ad: "",
                        organizationName: ""
                    }
                }
                action.data.employee = action.data.msg;
                action.data.oEmployee = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.UPDATEEMPLOYE]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.employee = action.data.msg;
                action.data.oEmployee = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};