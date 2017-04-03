import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        //注册代理商
        saveCorporationWarn: {
            "corporationName": '', //'请输入企业名称!',
            "corporationAddress": '', //'请输入企业地址!',
            "provinceId": '', //'请选择省份!',
            "cityId": '', //'请选择城市!',
            "corporationType": '', //'请选择企业性质!',
            "foundingTime": '', //'请选择成立时间!',
            "registeredCapital": '', //'请填写注册资金!',
            "financialSituation": '', //'请选择财务状况!',
            "teamPeople": '', //'请填写团队人数!',
            "officeAddress": '', //'请填写办公室地址!',
            "officeSize": '', //'请填写办公室面积!',
            "contactName": '', //'请填写联系人姓名!',
            "contactEmail": '', //'请填写联系人邮箱!',
            "contactMobile": '', //'请填写联系人手机号!',
            "smsCode": '', //'请填写验证码!'
        }
    },
    stroes: {}
};