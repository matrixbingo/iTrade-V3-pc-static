import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col,RadioGroup,Button} from 'eagle-ui';
import Styles from './ContactItem.less';
import {LikeButton, InputPlus, TextArea, validateType} from '../utils/index.jsx';
import LabelWarn from '../corporation/LabelWarn.jsx';

export default class ContactItem extends Component {

    constructor(props, context) {
        super(props, context);
        this.contactMobileValidRules = {
            isInt: true,
            maxLength: 11
        }
        this.state = {};
    }

    onChangeCallback(_this, value) {
        const key = _this.props.valueLink.split('.')[1];
        const valueLink = 'saveCorporationWarn.' + key;
        if (value && value.length > 0) {
            this.props.setValueByReducers(valueLink, '');
        } else {
            this.props.setValueByReducers(valueLink, validateType.saveCorporationWarn[key]);
        }
    }

    render() {
        const star = <span className="redFont">*</span>;
        const saveCorporationWarn = this.props.getValueByReducers('saveCorporationWarn').toJS();
        return (
            <div className="contactItem">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}联系人姓名:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onChangeCallback={::this.onChangeCallback}
                                   validRules={{maxLength:25}}
                                   valueLink='contact.contactName'
                                   placeholder='请填写联系人姓名'/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.contactName}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}联系人邮箱:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='contact.contactEmail'
                                   placeholder='请填写联系人邮箱'/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.contactEmail}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}联系人手机号:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='contact.contactMobile'
                                   validRules={this.contactMobileValidRules}
                                   placeholder='请填写联系人手机号'/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.contactMobile}/>
            </div>);
    }
}