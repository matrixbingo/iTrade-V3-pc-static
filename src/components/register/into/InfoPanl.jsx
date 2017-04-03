/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Label,Panel,PanelHeader,PanelContent} from 'eagle-ui';
import InfoList from './InfoList.jsx';
import LabelImg from './LabelImg.jsx';
import Title from './Title.jsx';
import Styles from './InfoPanl.less';

export default class InfoPanl extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const list = this.props.getValueByReducers('allCities');
        return (
            <div className="infoPanl">
                <Title />
                <Row>
                    <Col sm={12} className="info-col">
                        <LabelImg />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="info-col">
                        <InfoList list={list}/>
                    </Col>
                </Row>
            </div>);
    }
}