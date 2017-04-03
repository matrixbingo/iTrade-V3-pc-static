import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Button} from 'eagle-ui';
import Styles from './ContactItem.less';
import {LikeButton, InputPlus, TextArea, validateType} from '../utils/index.jsx';
import LabelWarn from '../corporation/LabelWarn.jsx';

export default class SmsCode extends Component {

    constructor(props, context) {
        super(props, context);
        this.contactMobileValidRules = {
            isInt: true,
            maxLength: 11
        }
        this.state = {
            contactMobile: ''
        };
    }

    onClickCallback(_this) {
        let saveCorporation = Object.assign({}, validateType.saveCorporation);
        if(saveCorporation.smsCode){
            delete saveCorporation.smsCode;
        }
        if (!_this.props.validateWarn(saveCorporation, 'saveCorporationWarn')){
            _this.props.showMsgError('请填写完以上信息再获取验证码');
            return;
        }

        const contactMobile = _this.props.getValueByReducers('contact.contactMobile');
        if (!contactMobile || contactMobile.length != 11) {
            _this.props.showMsgError('请输入11位的手机号！');
            return false;
        }
        _this.props.loadCorporationByMobileExist(contactMobile, _this, function (_this, data) {
            const contactMobile = _this.props.getValueByReducers('contact.contactMobile');
            if (data.code == 200 && data.msg == true) {
                _this.props.showMsgError('此手机号已被注册，请使用其他手机号');
                return false;
            } else {
                _this.handleClick();
                _this.props.sendSmsVerifyCode(contactMobile);
                console.log('发送验证码 --->', contactMobile);
                return true;
            }
        });
    }

    setLikeButtonRef(ref) {
        this.likeButton = ref;
    }

    onChangeCallback(_this, value) {
        const key = _this.props.valueLink;
        const valueLink = 'saveCorporationWarn.' + key;
        if (value && value.length > 0) {
            this.props.setValueByReducers(valueLink, '');
        } else {
            this.props.setValueByReducers(valueLink, validateType.saveCorporationWarn[key]);
        }
    }

    render() {
        const _this = this;
        const star = <span className="redFont">*</span>;
        return (
            <div className="contactItem">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}验证码:</span>
                    </Col>
                    <Col sm={8} className="end-col" style={{paddingTop: '0px'}}end>
                        <Col sm={5} className="end-code">
                            <InputPlus onChangeCallback={::this.onChangeCallback} config={this.props.config} valueLink='smsCode'/>
                        </Col>
                        <Col sm={7} className="end-code-button">
                            <LikeButton onClickCallback={this.onClickCallback} {...this.props}
                                        ref={(ref)=>{_this.setLikeButtonRef(ref)}}/>
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }
}