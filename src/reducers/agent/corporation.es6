import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        registerPhone: '',
        corporation: {
            "corporationId": 0,
            "corporationName": "",
            "corporationAddress": "",
            "provinceId": 0,
            "cityId": 0,
            "cityName": '',
            "corporationType": 0,
            "foundingTime": "",
            "registeredCapital": '',
            "financialSituation": "",
            "hasTeam": true,
            "teamPeople": '',
            "hasOffice": true,
            "officeAddress": "",
            "officeSize": '',
            "remark": "",
            "approveStatus": 0,
            "approveRemark": "",
            "cooperationStatus": 0,
            "creator": ""
        },
        smsCode: '',
        provinceList: [],
        cityList: [],
        agentList: {
            "list": [
                {
                    "corporationId": 1,
                    "corporationName": "孝杰公司沙比",
                    "corporationAddress": "长宁区",
                    "provinceId": 1,
                    "cityId": 2,
                    "corporationType": 1,
                    "foundingTime": "2016-12-29 05:53:39",
                    "registeredCapital": 10000000000000,
                    "financialSituation": "非常棒",
                    "hasTeam": true,
                    "teamPeople": 11111111,
                    "hasOffice": true,
                    "officeAddress": "德必易园",
                    "officeSize": 1999,
                    "remark": "我们很棒",
                    "approveStatus": 0,
                    "approveRemark": "不错的公司!",
                    "cooperationStatus": 0,
                    "creator": ""
                },
                {
                    "corporationId": 10,
                    "corporationName": "哇哈哈",
                    "corporationAddress": "长宁区",
                    "provinceId": 1,
                    "cityId": 2,
                    "corporationType": 1,
                    "foundingTime": "2016-12-29 08:16:20",
                    "registeredCapital": 10000000000000,
                    "financialSituation": "非常棒",
                    "hasTeam": true,
                    "teamPeople": 11111111,
                    "hasOffice": true,
                    "officeAddress": "德必易园",
                    "officeSize": 1999,
                    "remark": "我们很棒",
                    "approveStatus": 1,
                    "approveRemark": "不错的公司!",
                    "cooperationStatus": 1,
                    "creator": ""
                }
            ],
            "totalCount": 20,
            "page": 1,
            "pageSize": 10
        },
        //编辑代理商
        agentListSearch: {
            "provinceId":-1,
            "corporationId": "",
            "corporationName": "",
            "approveStatus": null,
            "cooperationStatus": null,
            "page": 1,
            "pageSize": 10
        },
        //更新公司审核状态
        approveStatus: {
            corporationId: 0,
            status: 0,
            approveRemark: ''
        },
        //提示框临时变量
        showMsgDialogModal:{
            width : 0
        }
    },
    stroes: {
        [actionType.LOADPROVINCELIST]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.provinceList = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.LOADCITYLISTBYPROVINCEID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.cityList = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.LOADCORPORATIONLIST]: (data, action) => {
            if (action.data && action.data.code == 200 && action.data.msg) {
                action.data.agentList = action.data.msg;
                action.data.agentListSearch = data.toJS().agentListSearch;
                action.data.agentListSearch.page = action.data.msg.page;
                action.data.agentListSearch.pageSize = action.data.msg.pageSize;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        },
        [actionType.LOADCORPORATIONBYID]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.msg.foundingTime = action.data.msg.foundingTime.length > 10 ? action.data.msg.foundingTime.substr(0, 10) : action.data.msg.foundingTime;
                action.data.corporation = action.data.msg;
                action.data.oCorporation = action.data.msg;
                if (action.data.corporation && action.data.corporation.length > 10) {
                    action.data.corporation = action.data.corporation.foundingTime.substr(0, 10);
                }
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};