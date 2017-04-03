import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import Styles from './Head.less';
import HeadTitle from './Title.jsx';
import Label from './Label.jsx';
import {Dialog,Grid,Row,Col,Button} from 'eagle-ui';
import InputPlus from '../../utils/input/InputPlus.jsx';
import {getEum} from '../../utils/agent/agentUtils.es6';
import LabelImg from './LabelImg.jsx';

export default class Head extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
        this.phoneNoLength = 11;
        this.registerPhoneValidRules = {
            isInt: true,
            isFloat: false,
            maxLength: 11
        };
    }

    searchProgress() {
        const registerPhone = this.props.getValueByReducers('registerPhone');
        if (registerPhone.length != this.phoneNoLength) {
            this.props.alertMsg('请输入11位手机号!', '');
            return;
        }
        console.log('查询手机号:', registerPhone);
        this.props.loadApproveStatusByMobile(registerPhone, this, this.searchCallBack);
    }

    searchCallBack(_this, data) {
        if (data.code == 200 && data.msg == null) {
            const msg = getEum().getApproveStatusAlert('null');
            _this.props.alertMsg(msg.main, msg.content);
        } else {
            const msg = getEum().getApproveStatusAlert(data.msg.approveStatus);
            _this.props.alertMsg(msg.main, msg.content);
        }
    }

    agentInfo(){
        window.location.href = 'index/info';
        //window.open('index/info');
    }

    render() {
        return (
            <div className="head">
                <HeadTitle/>
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col sm={4} style={{paddingRight: '0px',paddingTop: '14px'}}>
                                <span style={{float: 'right', fontSize: '16px'}}>审批进度查询</span>
                            </Col>
                            <Col sm={5} style={{paddingRight: '5px',paddingLeft: '5px'}}>
                                <InputPlus config={this.props.config} validRules={this.registerPhoneValidRules}
                                           placeholder='请输入手机号查询'
                                           valueLink='registerPhone'/>
                            </Col>
                            <Col sm={3} style={{paddingLeft: '0px'}}>
                                <div className="button-right">
                                    <Button radius egSize="sm" block onClick={::this.searchProgress}>查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="col-span">
                        <span className="gray">2016年，我们完成中国互联网历史性的战略合作——美团点评平台融合， 融合后的美团点评是中国最大的服务业互联网平台。2017年，我们向全社会正式启动城市代理商招募， 招募详情，请参考</span>
                        <span className="orange" onClick={this.agentInfo} >《代理商细则》</span>
                        <span className="gray"></span>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} style={{padding: '20px 35px 20px 35px'}}>
                        <LabelImg />
                    </Col>
                </Row>
            </div>);
    }
}