export const validateType = {
    //新增员工
    addEmploye: {
        "reportLoginId": {
            l: 'employeeEnditorPage.reportEmploye.loginId',
            m: {
                required: '请选汇报对象!',
                zero: '请选汇报对象!'
            }
        },
        "name": {
            l: 'employee.name',
            m: {
                required: '请输入姓名!'
            }
        },
        "ad": {
            l: 'employee.ad',
            m: {
                required: '请输入登录名!'
            }
        },
        "cityId": {
            l: 'employee.cityId',
            m: {
                zero: '请选择城市!',
                required: '请选择城市!'
            }
        },
        "idCard": {
            l: 'employee.idCard',
            m: {
                lgalIdCard: '请输入有效身份证号码!'
            }
        },
        "email": {
            l: 'employee.email',
            m: {
                email: '请输入有效的邮箱!'
            }
        },
        "mobile": {
            l: 'employee.mobile',
            m: {
                mobile: '请填写正确的手机号格式!'
            }
        }
    },

    //注册代理商
    saveCorporation: {
        "corporationName": {
            l: 'corporation.corporationName',
            m: {
                required: '请输入企业名称'
            }
        },
        "corporationAddress": {
            l: 'corporation.corporationAddress',
            m: {
                required: '请输入企业地址'
            }
        },
        "provinceId": {
            l: 'corporation.provinceId',
            m: {
                zero: '请选择省份',
                required: '请选择省份'
            }
        },
        "cityId": {
            l: 'corporation.cityId',
            m: {
                zero: '请选择城市',
                required: '请选择城市'
            }
        },
        "corporationType": {
            l: 'corporation.corporationType',
            m: {
                zero: '请选择企业性质!',
                required: '请选择企业性质'
            }
        },
        "foundingTime": {
            l: 'corporation.foundingTime',
            m: {
                required: '请选择成立时间'
            }
        },
        "registeredCapital": {
            l: 'corporation.registeredCapital',
            m: {
                required: '请填写注册资金'
            }
        },
        "financialSituation": {
            l: 'corporation.financialSituation',
            m: {
                required: '请选择财务状况'
            }
        },
        "hasTeam": {
            l: 'corporation.hasTeam',
            m: {
                boolean: '请选择有无团队'
            },
            callback: function (_this, item, warns, DataUtil) {
                if (item.v) {
                    const v = _this.getValueByReducers('corporation.teamPeople');
                    if(!DataUtil.validate.required(v) || !DataUtil.validate.zero(v)){
                        warns.teamPeople = '请填写团队人数';
                        return false;
                    }else{
                        warns.teamPeople = '';
                        return true;
                    }
                }
                return true;
            }
        },
        "hasOffice": {
            l: 'corporation.hasOffice',
            m: {
                boolean: '请选择办公室情况'
            },
            callback: function (_this, item, warns, DataUtil) {
                let flag = true;
                if (item.v) {
                    let v = _this.getValueByReducers('corporation.officeAddress');
                    if(!DataUtil.validate.required(v)){
                        warns.officeAddress = '请填写办公室地址';
                        flag =  false;
                    }else{
                        warns.officeAddress = '';
                    }
                    v = _this.getValueByReducers('corporation.officeSize');
                    if(!DataUtil.validate.required(v) || !DataUtil.validate.zero(v)){
                        warns.officeSize = '请填写办公室面积';
                        flag = false;
                    }else{
                        warns.officeSize = '';
                    }
                }
                return flag;
            }
        },
        "contactName": {
            l: 'contact.contactName',
            m: {
                required: '请填写联系人姓名'
            }
        },
        "contactEmail": {
            l: 'contact.contactEmail',
            m: {
                required: '请填写联系人邮箱',
                email: '请填写联系人邮箱'
            }
        },
        "contactMobile": {
            l: 'contact.contactMobile',
            m: {
                required: '请填写联系人手机号',
                mobile: '请填写联系人手机号'
            }
        },
        "smsCode": {
            l: 'smsCode',
            m: {
                required: '请填写验证码'
            }
        }
    },
    //更新公司
    updateCorporation: {
        "corporationName": {
            l: 'corporation.corporationName',
            m: {
                required: '请输入企业名称!'
            }
        },
        "corporationAddress": {
            l: 'corporation.corporationAddress',
            m: {
                required: '请输入企业地址!'
            }
        },
        "provinceId": {
            l: 'corporation.provinceId',
            m: {
                zero: '请选择省份!',
                required: '请选择省份!'
            }
        },
        "cityId": {
            l: 'corporation.cityId',
            m: {
                zero: '请选择城市!',
                required: '请选择城市!'
            }
        },
        "corporationType": {
            l: 'corporation.corporationType',
            m: {
                zero: '请选择企业性质!!',
                required: '请选择企业性质!'
            }
        },
        "foundingTime": {
            l: 'corporation.foundingTime',
            m: {
                required: '请选择成立时间!'
            }
        },
        "registeredCapital": {
            l: 'corporation.registeredCapital',
            m: {
                required: '请填写注册资金!'
            }
        },
        "financialSituation": {
            l: 'corporation.financialSituation',
            m: {
                required: '请选择财务状况!'
            }
        },
        "hasTeam": {
            l: 'corporation.hasTeam',
            m: {
                boolean: '请选择有无团队!'
            },
            callback: function (_this, item) {
                if (item.v) {
                    const teamPeople = {
                        teamPeople: {
                            l: 'corporation.teamPeople',
                            m: {
                                required: '请填写团队人数!',
                                zero: '请填写团队人数!'
                            }
                        }
                    }
                    return _this.validate(teamPeople);
                }
                return true;
            }
        },
        "hasOffice": {
            l: 'corporation.hasOffice',
            m: {
                boolean: '请选择办公室情况!'
            },
            callback: function (_this, item) {
                if (item.v) {
                    const office = {
                        officeAddress: {
                            l: 'corporation.officeAddress',
                            m: {
                                required: '请填写办公室地址!'
                            }
                        },
                        officeSize: {
                            l: 'corporation.officeSize',
                            m: {
                                required: '请填写办公室面积!',
                                zero: '请填写办公室面积!'
                            }
                        }
                    }
                    return _this.validate(office);
                }
                return true;
            }
        },
        "contactName": {
            l: 'contact.contactName',
            m: {
                required: '请填写联系人姓名!'
            }
        },
        "contactEmail": {
            l: 'contact.contactEmail',
            m: {
                required: '请填写联系人邮箱!',
                email: '请填写正确的邮箱格式!'
            }
        },
        "contactMobile": {
            l: 'contact.contactMobile',
            m: {
                required: '请填写联系人手机号!',
                mobile: '请填写正确的手机号格式!'
            }
        }
    },
    saveCorporationWarn: {
        "corporationName": '请输入企业名称',
        "corporationAddress": '请输入企业地址',
        "provinceId": '请选择省份',
        "cityId": '请选择城市',
        "corporationType": '请选择企业性质',
        "foundingTime": '请选择成立时间',
        "registeredCapital": '请填写注册资金',
        "financialSituation": '请选择财务状况',
        "teamPeople": '请填写团队人数',
        "officeAddress": '请填写办公室地址',
        "officeSize": '请填写办公室面积',
        "contactName": '请填写联系人姓名',
        "contactEmail": '请填写联系人邮箱',
        "contactMobile": '请填写联系人手机号',
        "smsCode": '请填写验证码'
    }
};