/**
 * Created by liang.wang on 16/5/16.
 */
import React, { Component ,PropTypes} from 'react';
import classNames from 'classnames'
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col} from 'eagle-ui';
import Styles from './img/img.less';
import LabelTite from './LabelTite.jsx';

export default class LabelImg extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='labelImg'>
                <LabelTite title='合作代理商的要求' />
                <Row>
                    <Col sm={12} style={{height:'20px'}}></Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <div className='cooperation'></div>
                    </Col>
                    <Col sm={4} className='col'>
                        <div className='manage'></div>
                    </Col>
                    <Col sm={4} className='col'>
                        <div className='www'></div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <span className='span-title'>长期合作</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-title'>规划管理</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-title'>互联网经验</span>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <span className='span-content'>了解并认同美团点评企业文化和业务模式，愿意与美团点评保持长期合作。</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-content'>认同并接受美团点评的管理制度和发展规划。</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-content'>有互联网或美业相关经验，并对互联网和美业充满热情。</span>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <div className='business'></div>
                    </Col>
                    <Col sm={4} className='col'>
                        <div className='qualification'></div>
                    </Col>
                    <Col sm={4} className='col'></Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <span className='span-title'>经营能力</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-title'>企业资格</span>
                    </Col>
                    <Col sm={4} className='col'></Col>
                </Row>
                <Row>
                    <Col sm={4} className='col'>
                        <span className='span-content'>了解并认同美团点评企业文化和业务模式，愿意与美团点评保持长期合作。</span>
                    </Col>
                    <Col sm={4} className='col'>
                        <span className='span-content'>认同并接受美团点评的管理制度和发展规划。</span>
                    </Col>
                    <Col sm={4} className='col'>
                    </Col>
                </Row>
                <LabelTite title='招募城市名单' />
            </div>
        )
    }
}