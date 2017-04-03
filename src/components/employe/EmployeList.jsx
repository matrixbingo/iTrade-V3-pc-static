/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Grid,Row,Col,Label,Panel,PanelHeader,PanelContent,Paging,Select,Button} from 'eagle-ui';
import {InputPlus, SelectPlus} from '../utils/index.jsx';
import EmployeRow from './EmployeRow.jsx';
import Styles from './EmployeRow.less';
import {DataUtil} from '../../utils/utils.es6';

export default class EmployeList extends Component {

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
    }

    searchList() {
        const searchData = this.props.getValueByReducers('searchData').toJS();
        //this.props.loadCorporationList(agentListSearch);
        console.log('查询员工列表', searchData);
    }

    loadPageCallback(ps) {
        this.pageNo = 1;
        this.pageSize = parseInt(ps);
        let param = {page: this.pageNo, pageSize: this.pageSize};
        this.props.loadCorporationList(param);
    }

    callback(p) {
        this.pageNo = p;
        let param = {page: p, pageSize: this.pageSize};
        this.props.loadCorporationList(param);
    }

    addEmploye() {
        const agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        let employee = this.props.getValueByReducers('employee').toJS();
        employee = DataUtil.cleanJson(employee);
        employee.gender = 2;
        this.props.setValueByReducers('employee', employee);
        this.props.setValueByReducers('employeEditorPage.editorType', 0);
        this.props.setValueByReducers('power.tabType', 2);
        this.props.loadOrgCorporationbyId(agentListSearch.corporationId);
        this.props.setTabIndex(4);
    }

    render() {
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const corporation = this.props.getValueByReducers('corporation').toJS();
        let employeList = this.props.getValueByReducers('employeListAll');
        const list = employeList; //employeList.get('list');
        let totals = 0;
        //console.log('list', list.toJS());
        /*
         if (employeList) {
         employeList = employeList.toJS();
         totals = employeList.totalCount;
         }*/

        return (
            <div className="employeList outerPanel marginTopSpace replyContent margin-top-10">
                <Row>
                    <Col sm={12}>
                        <h2>{corporation.corporationName}</h2>
                    </Col>
                </Row>
                <Panel className="marginTopSpace">
                    <Row style={{display: corporation.cooperationStatus == 1? 'block':'none'}}>
                        <Col sm={2}>
                            <Button radius egSize="sm" block onClick={::this.addEmploye}>新建员工</Button>
                        </Col>
                        <Col sm={10}></Col>
                    </Row>
                    <Row style={{display:'none'}}>
                        <Col sm={2}>
                            <InputPlus config={this.props.config} valueLink='employeSearchData.name'
                                       placeholder='请输入名字'/>
                        </Col>
                        <Col sm={2}>
                            <InputPlus config={this.props.config} valueLink='employeSearchData.phone'
                                       placeholder='请输入手机号码'/>
                        </Col>
                        <Col sm={2}>
                            <SelectPlus list={defaultDara.status}
                                        config={this.props.config}
                                        valueLink='employeSearchData.status'
                                        placeholder="生效状态"/>
                        </Col>
                        <Col sm={2}>
                            <Button radius egSize="sm" block onClick={::this.searchList}>查询</Button>
                        </Col>
                        <Col sm={4}> </Col>
                    </Row>
                    <PanelHeader className="marginSpacePanelHeader">
                        <Row className="background-color">
                            <Col sm={1} className="text-align-center">
                                姓名
                            </Col>
                            <Col sm={2} className="text-align-center">
                                登录名
                            </Col>
                            <Col sm={1} className="text-align-center">
                                汇报人
                            </Col>
                            <Col sm={2} className="text-align-center">
                                身份证
                            </Col>
                            <Col sm={1} className="text-align-center">
                                城市
                            </Col>
                            <Col sm={2} className="text-align-center">
                                手机号
                            </Col>
                            <Col sm={1} className="text-align-center">
                                状态
                            </Col>
                            <Col sm={2} className="text-align-center">
                                操作
                            </Col>
                        </Row>
                        {list && <EmployeRow {...this.props} list={list}/>}
                    </PanelHeader>
                    <PanelContent>
                        <Row className="paging-margin" style={{display:'none'}}>
                            <Col sm={1}>

                            </Col>
                            <Col sm={11}>
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