import _ from "underscore";

export function getEum() {
    const getApproveStatus = function (type) {
        const data = {
            0: '待审核',
            1: '审核通过',
            2: '审核驳回'
        }
        return data[type];
    };

    const getApproveStatusAlert = function (type) {
        const data = {
            'null': {main:'抱歉！您查询的手机号码，没有申请过代理商！',content : '请核对您的手机号，再次查询'},
            0:  {main:'您申请的资料正在审核中，预计3个工作日内完成审批', content : '请保持手机通畅'},
            1: {main:'恭喜！您的申请已经通过审批！', content :'我们将在3个工作日内与您联系'},
            2: {main:'很抱歉，您申请的资料，暂时不符合我方要求，期待与您再次合作！', content :'感谢您对美团点评的关注'}
        }
        return data[type];
    };

    const getCooperationStatus = function (type) {
        const data = {
            0: '未合作',
            1: '已合作',
            2: '停止合作'
        }
        return data[type];
    };

    return {
        getApproveStatus: getApproveStatus,
        getCooperationStatus: getCooperationStatus,
        getApproveStatusAlert: getApproveStatusAlert
    };
};

