import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col,Button} from 'eagle-ui';
import CorporationInfo from './../../corporation/CorporationInfo.jsx';
import TitleRight from './TitleRight.jsx';
import ContactItem from '../../contact/ContactItem.jsx';
import Styles from './RegisterMain.less';
import {DataUtil,HipoUtil} from '../../../utils/utils.es6';
import SmsCode from '../../contact/SmsCode.jsx';
import {validateType} from '../../../constants/validate-type.es6';
import LabelWarn from '../../corporation/LabelWarn.jsx';

export default class RegisterMain extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    submit(){
        //this.props.alertMsg('很抱歉，您申请的资料，暂时不符合我方要求，期待与您再次合作！', '感谢您对美团点评的关注', true);
        if (!this.props.validateWarn(validateType.saveCorporation, 'saveCorporationWarn')){
            this.props.showMsgError('注册信息填写有误');
            return;
        }
        let corporation = this.props.getValueByReducers('corporation').toJS();
        let contact = this.props.getValueByReducers('contact').toJS();
        corporation.registeredCapital = corporation.registeredCapital.replace(/,/g, '');
        corporation.foundingTime = corporation.foundingTime + ' 00:00:00';
        const smsCode = this.props.getValueByReducers('smsCode');
        const saveCorporation = this.props.getValueByReducers('saveCorporation').toJS();
        corporation = DataUtil.transfor(saveCorporation.corporation,corporation);
        contact = DataUtil.transfor(saveCorporation.corporationContacts[0],contact);
        console.log('注册代理商', corporation, '新增联系人', contact, 'smsCode', smsCode);
        HipoUtil.submit();
        this.props.addCorporation(corporation, contact, smsCode, this, function(_this, data){
            if(data.code == 200 && data.msg.corporation.corporationId != 0){
                _this.props.alertMsg('恭喜,您的资料已提交成功！', '预计3个工作日内完成审批', true);
            }
        });
    }

    render() {
        const saveCorporationWarn = this.props.getValueByReducers('saveCorporationWarn').toJS();
        return (
            <div className="registerMain">
                <TitleRight title="公司信息"/>
                <CorporationInfo {...this.props} title='代理商在线申请表'/>
                <TitleRight title="联系人信息"/>
                <ContactItem {...this.props}/>
                <SmsCode {...this.props}/>
                <LabelWarn title={saveCorporationWarn.smsCode}/>
                <Row>
                    <Col sm={12}></Col>
                </Row>
                <Row>
                    <Col sm={12} className="title-span">
                        <span>
                            请如实填写公司信息，美团点评不会将您的信息透露给第三方组织
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                        <Button radius egSize="sm" block onClick={::this.submit}>提交申请</Button>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col sm={12}></Col>
                </Row>
            </div>);
    }
}