export default {
    param: {
        defaultDara: {
            //企业性质
            corporationTypeEum: {
                1: '国有企业',
                2: '外资企业',
                3: '私营企业',
                4: '合伙经营',
                5: '个体经营'
            },
            //财务状况
            financialSituationEum: {
                '流动资金0-1万': '流动资金0-1万',
                '流动资金1-10万': '流动资金1-10万',
                '流动资金10-100万': '流动资金10-100万',
                '流动资金100万以上': '流动资金100万以上'
            },
            hasTeamEum: {
                false: '无团队',
                true: '有团队'
            },
            hasOfficeEum: {
                false: '无固定办公室',
                true: '有固定办公室'
            },
            //员工生效状态
            status: {
                1: '未生效',
                2: '已生效',
                3: '已离职'
            },
            gender: {
                1: '男',
                2: '女'
            },
            cooperationStatus: {
                0: '未合作',
                1: '已合作',
                2: '停止合作'
            }
        },
        //注册代理商格式
        saveCorporation: {
            "corporation": {
                "corporationName": "孝杰公司",
                "corporationAddress": "长宁区",
                "provinceId": 1,
                "cityId": 2,
                "corporationType": 1,
                "foundingTime": "2016-12-29 05:54:55",
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
            },
            "corporationContacts": [
                {
                    "contactName": "陈孝杰",
                    "contactEmail": "abc@dianping.com",
                    "contactMobile": 13476147026,
                    "creator": "xiaojie.chen"
                }
            ],
            "smsCode": "734020"
        },
        //更新公司
        updateCorporation: {
            "corporationId": 0,
            "corporationName": "",
            "corporationAddress": "",
            "provinceId": 0,
            "cityId": 0,
            "corporationType": 0,
            "foundingTime": "",
            "registeredCapital": 0,
            "financialSituation": "",
            "hasTeam": true,
            "teamPeople": '',
            "hasOffice": true,
            "officeAddress": "",
            "officeSize": 0,
            "remark": "",
            "approveStatus": '',
            "approveRemark": "",
            "cooperationStatus": 0,
            "creator": ""
        },
        //更新联系人
        updateContact: {
            "contactId": 2,
            "corporationId": 6,
            "contactName": "测试更新",
            "contactEmail": "abcE@dianping.com",
            "contactMobile": "13838384388",
            "creator": ""
        },
        //新增员工
        addEmploye: {
            "ad": "",
            "cityId": '',
            "email": "",
            "gender": 0,
            "idCard": "",
            "mobile": "",
            "name": "",
            "reportLoginId": 0
        },
        //更新员工
        updateEmploye: {
            "loginId": 0,
            "cityId": '',
            "email": "",
            "gender": 0,
            "idCard": "",
            "mobile": "",
            "name": "",
            "reportLoginId": -40480
        }
    },
    stroes: {}
};