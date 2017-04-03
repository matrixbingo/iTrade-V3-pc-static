/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Grid,Row,Col,Label,Panel,PanelHeader,PanelContent,Paging,Select,Button} from 'eagle-ui';
import AgentRow from './AgentRow.jsx';
import Styles from './AgentRow.less';
import {bindingMixin,Toast} from 'eg-tools';
import {CalendarPanelPlus,SelectPlus,InputPlus} from '../utils/index.jsx';

export default class AgentList extends Component {

    constructor(props, context) {
        super(props, context);
        this.pageSize = 10;
        this.pageNo = 1;
        this.state = {
            toastType: "success",
            toastMsg: ""
        };

        this.searchParam = {
            corporationName: '',
            approveStatus: null,
            cooperationStatus: null,
            page: 1,
            pageSize: 10
        };
        this.props.loadProvinceList();
        //this.props.loadCorporationList(this.searchParam);
    }

    loadPageCallback(ps) {
        this.pageNo = 1;
        this.pageSize = parseInt(ps);
        //let param = {page: this.pageNo, pageSize: this.pageSize};
        const agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        let param  = {
            corporationName: agentListSearch.corporationName,
            approveStatus: agentListSearch.approveStatus,
            cooperationStatus: agentListSearch.cooperationStatus,
            provinceId: agentListSearch.provinceId,
            page: this.pageNo,
            pageSize: this.pageSize
        };
        this.props.loadCorporationList(param);
    }

    callback(p) {
        this.pageNo = p;
        //let param = {page: p, pageSize: this.pageSize};
        const agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        let param  = {
            corporationName: agentListSearch.corporationName,
            approveStatus: agentListSearch.approveStatus,
            cooperationStatus: agentListSearch.cooperationStatus,
            provinceId: agentListSearch.provinceId,
            page: p,
            pageSize: this.pageSize
        };
        this.props.loadCorporationList(param);
    }

    chooseCooperationStatus(value, key, type) {
        this.setState({
            cooperationStatus: key
        })
        this.props.setValueByReducers('agentListSearch.cooperationStatus', value);
        //console.log('value,key,type', value, key, type);
    }

    chooseApproveStatus(value, key, type) {
        this.setState({
            approveStatus: key
        })
        this.props.setValueByReducers('agentListSearch.approveStatus', value);
        //console.log('value,key,type', value, key, type);
    }

    searchList() {
        let agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        agentListSearch.page = 1;
        agentListSearch.pageSize = 10;
        this.pageNo = 1;
        this.pageSize = 10;
        this.props.loadCorporationList(agentListSearch);
        console.log('查询代理商列表', agentListSearch);
    }

    downloadExcel() {
        let agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        this.props.downloadExcel(agentListSearch);
        console.log('导出明细', agentListSearch);
    }

    render() {
        let agentList = this.props.getValueByReducers('agentList');
        const provinceList = this.props.getValueByReducers('provinceList').toJS();
        const list = agentList.get('list');
        let totals;
        if (agentList) {
            agentList = agentList.toJS();
            totals = agentList.totalCount;
        }
        //console.log('this.pageNo: ' + this.pageNo + ' this.pageSize: ' + this.pageSize + ' totals: ' + totals);
        return (
            <div className="agentList outerPanel marginTopSpace replyContent margin-top-10">
                <Panel className="marginTopSpace">
                    <Row>
                        <Col sm={2}>
                            <InputPlus config={this.props.config} valueLink='agentListSearch.corporationName'
                                       placeholder='请输入代理商名称'/>
                        </Col>
                        <Col sm={2}>
                            <SelectPlus list={provinceList}
                                        config={this.props.config}
                                        addOptions={{need:true,options:{id:'-1',name:'全部'}}}
                                        param={{id:'provinceId', name:'provinceName'}}
                                        valueLink='agentListSearch.provinceId'
                                        placeholder="请选择省份"/>
                        </Col>
                        <Col sm={2}>
                            <Select defaultChecked={this.state.cooperationStatus}
                                    getValueCallback={::this.chooseCooperationStatus} placeholder="合作状态">
                                <option value={null} key={null}>全部</option>
                                <option value={0} key={0}>未合作</option>
                                <option value={1} key={1}>已合作</option>
                                <option value={2} key={2}>停止合作</option>
                            </Select>
                        </Col>
                        <Col sm={2}>
                            <Select defaultChecked={this.state.approveStatus}
                                    getValueCallback={::this.chooseApproveStatus} placeholder="审核状态">
                                <option value={null} key={null}>全部</option>
                                <option value={0} key={0}>待审核</option>
                                <option value={1} key={1}>审核通过</option>
                                <option value={2} key={2}>审核失败</option>
                            </Select>
                        </Col>
                        <Col sm={2}>
                            <Button radius egSize="sm" block onClick={::this.searchList}>查询</Button>
                        </Col>
                        <Col sm={4}> </Col>
                    </Row>
                    <PanelHeader className="marginSpacePanelHeader">
                        <Row className="background-color">
                            <Col sm={3} className="text-align-center">
                                公司名称
                            </Col>
                            <Col sm={1} className="text-align-center">
                                省份
                            </Col>
                            <Col sm={1} className="text-align-center">
                                城市
                            </Col>
                            <Col sm={2} className="text-align-center">
                                负责人
                            </Col>
                            <Col sm={1} className="text-align-center">
                                合作状态
                            </Col>
                            <Col sm={2} className="text-align-center">
                                审核状态
                            </Col>
                            <Col sm={2} className="text-align-center">
                                操作
                            </Col>
                        </Row>
                        {list && <AgentRow {...this.props} list={list}/>}
                    </PanelHeader>
                    <PanelContent>
                        <Row className="paging-margin">
                            <Col sm={2}>
                                <Button radius egSize="sm" block onClick={::this.downloadExcel}>导出明细</Button>
                            </Col>
                            <Col sm={9}>
                                <Paging showItemsNumber={true} loadPageCallback={::this.loadPageCallback}
                                        currentPage={this.pageNo} pageSize={this.pageSize}
                                        pageCallback={::this.callback} total={totals && totals > 0 ? totals : 0}/>
                            </Col>
                        </Row>
                    </PanelContent>
                </Panel>
            </div>
        );
    }
}