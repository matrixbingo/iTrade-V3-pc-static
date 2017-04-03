import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col,RadioGroup} from 'eagle-ui';
import Styles from './CorporationInfo.less';
import InputPlus from '../utils/input/InputPlus.jsx';
import TextArea from '../utils/textArea/TextArea.jsx';

export default class ContactPanel extends Component {

    static defaultProps = {
        title: ''
    }

    constructor(props, context) {
        super(props, context);

        this.state = {};
    }


    render() {
        const star = <span className="redFont">*</span>;
        return (
            <div className="">

            </div>);
    }
}