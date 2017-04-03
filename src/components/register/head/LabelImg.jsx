/**
 * Created by liang.wang on 16/5/16.
 */
import React, { Component ,PropTypes} from 'react';
import classNames from 'classnames'
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col} from 'eagle-ui';
import Styles from './img/img.less';
import LabelTite from '../into/LabelTite.jsx';
import {imgType} from './img/img-type.es6';

export default class LabelImg extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='labelImg'>
                <LabelTite title='合作流程'/>
                <Row>
                    <Col sm={12} style={{height:'20px'}}></Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        {this.getImg('sq')}
                    </Col>
                    <Col sm={4} className='col'>
                        {this.getImg('sp')}
                    </Col>
                    <Col sm={4} className='col'>
                        {this.getImg('hz')}
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <span className='span-title'>第一步 申请</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-title'>第二步 审批</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-title'>第三步 合作</span>
                    </Col>
                </Row>
                <Row style={{height: '35px'}}>
                    <Col sm={12}></Col>
                </Row>
                <LabelTite title='合作申请'/>
            </div>
        )
    }

    getImg(type) {
        const src = imgType[type];
        return <img className="img" onClick={this.imgClick} src={src}></img>
    }
}