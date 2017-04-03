import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,Button} from 'eagle-ui';
import Styles from './EmployeIndex.less';
import {transfor} from '../../utils/utils.es6';
import EmployeMain from './employeManage/EmployeMain.jsx';

export default class EmployeIndex extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    submit(){
        let corporation = this.props.getValueByReducers('corporation').toJS();
        let contact = this.props.getValueByReducers('contact').toJS();
        corporation.registeredCapital = corporation.registeredCapital.replace(/,/g, '');
        corporation.foundingTime = corporation.foundingTime + ' 00:00:00';
        const smsCode = this.props.getValueByReducers('smsCode');
        const saveCorporation = this.props.getValueByReducers('saveCorporation').toJS();
        corporation = transfor(saveCorporation.corporation,corporation);
        contact = transfor(saveCorporation.corporationContacts[0],contact);
        console.log('注册代理商', corporation, '新增联系人', contact, 'smsCode', smsCode);
        this.props.addCorporation(corporation, contact, smsCode);
    }

    render() {
        return (
            <div>
                <EmployeMain {...this.props} />
            </div>);
    }
}