/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Button} from 'eagle-ui';
import Styles from './TradeRow.less';
import classNames from 'classnames';
import {setTab, getRootPath, DataUtil, FormUtil} from '../../utils/utils.es6';
import {getEum} from '../utils/agent/agentUtils.es6';
import Msg from '../utils/chart/Msg.jsx';

export default class TradeRow extends Component {

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

    loadCorporationbyIdCallback(_this, data) {
        _this.props.loadCityListByProvinceId(data.msg.provinceId);
    }

    render() {
        const _this = this;
        const list = this.props.list;
        const pageNo = this.props.pageNo;
        const pageSize = this.props.pageSize;
        let rowNo = 1;
        let page = (pageNo - 1) * pageSize + 1;
        let url;
        return (
            <div className="tradeRow">
                {
                    list && list.map((ele)=> {
                        let rowColor = rowNo % 2 == 0 ? 'row-color-odd' : 'row-color-eve';
                        let colColor = ele.get('range') > 0 ? {color: 'red'} : {color: 'green'};
                        url = FormUtil.getStockUrl(ele.get('code'));
                        if (ele.get('range') == 0) {
                            colColor = {};
                        }
                        rowNo++;
                        return <Row key={rowNo} className={rowColor}>
                            <Col sm={1} className="text-align-center">
                                <Msg value = {page++} ele={ele.toJS()} {...this.props} />
                            </Col>
                            <Col style={{width:'14%'}} className="text-align-center">
                                {DataUtil.getType(ele.get('type'))}
                            </Col>
                            <Col style={{width:'11%'}} className="text-align-center">
                                {DataUtil.formatTime(ele.get('time'))}
                            </Col>
                            <Col sm={1} className="text-align-center">
                                {ele.get('code')}
                            </Col>
                            <Col sm={1} className="text-align-center">
                                <a href={url} target="_blank">{ele.get('name')}</a>
                            </Col>
                            <Col sm={1} className="text-align-center" style={colColor}>
                                {ele.get('price')}
                            </Col>
                            <Col sm={1} className="text-align-center" style={colColor}>
                                {ele.get('range')}
                            </Col>
                            <Col sm={1} className="text-align-center" style={colColor}>
                                {ele.get('speed')}
                            </Col>
                            <Col sm={1} className="text-align-center">
                                {ele.get('stock')}
                            </Col>
                            <Col sm={1} className="text-align-center" style={ele.get('buy')!=0? {color:'red'} : {}}>
                                {ele.get('buy')}
                            </Col>
                            <Col sm={1} className="text-align-center" style={{color:'green'}}>
                                {ele.get('sel')}
                            </Col>
                        </Row>
                    })
                }
            </div>
        );
    }
}