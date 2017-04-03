/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Button} from 'eagle-ui';
import Styles from './AgentRow.less';
import classNames from 'classnames';
import {setTab, getRootPath} from '../../utils/utils.es6';
import {getEum} from '../utils/agent/agentUtils.es6';

export default class AgentRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    checkAgent(id, type) {
        //let power = this.setValueByReducers('')
        this.props.setValueByReducers('power.agentEditor', type);
        this.props.setValueByReducers('agentListSearch.corporationId', id);
        this.props.loadCorporationbyId(id, this, this.loadCorporationbyIdCallback);
        this.props.loadAllContactsbyId(id);
        this.props.setValueByReducers('power.tabType', 1);
        this.props.setTabIndex(1);
    }

    loadCorporationbyIdCallback(_this, data){
        _this.props.loadCityListByProvinceId(data.msg.provinceId);
    }

    render() {
        const _this = this;
        const list = this.props.list;
        let rowNo = 1;

        return (
            <div className="agentRow">
                {
                    list && list.map((ele)=> {
                        let rowColor = rowNo % 2 == 0 ? 'row-color-odd' : 'row-color-eve';
                        rowNo++;
                        return <Row className={rowColor}>
                            <Col sm={3} className="text-align-center padding-top-20 cursor">
                                <span onClick={this.checkAgent.bind(_this, ele.get('corporationId'), 0)}>{ele.get('corporationName')}</span>
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {ele.get('provinceName')}
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {ele.get('cityName')}
                            </Col>
                            <Col sm={2} className="text-align-center padding-top-20">
                                {ele.get('managerName')}
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {getEum().getCooperationStatus(ele.get('cooperationStatus'))}
                            </Col>
                            <Col sm={2} className="text-align-center padding-top-20">
                                {getEum().getApproveStatus(ele.get('approveStatus'))}
                            </Col>
                            <Col sm={2} className="text-align-center">
                                <Button block radius egSize="sm" egStyle="link"
                                        onClick={this.checkAgent.bind(_this, ele.get('corporationId'), 0)}>查看</Button>
                            </Col>
                        </Row>
                    })
                }
            </div>
        );
    }
}