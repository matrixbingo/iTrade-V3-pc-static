/**
 * Created by liang.wang on 16/5/16.
 */
import React, { Component ,PropTypes} from 'react';
import classNames from 'classnames'
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col} from 'eagle-ui';
import Styles from './img/img.less';

export default class LabelTite extends Component {

    static defaultProps = {
        title: ''
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='labelImg'>
                <Row>
                    <Col sm={12} className='col title position'>
                        <div className='line'></div>
                        <span className="col-span">{this.props.title}</span>
                    </Col>
                </Row>
            </div>
        );
    }

;


}