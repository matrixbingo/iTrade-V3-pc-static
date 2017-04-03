import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid,Row,Col,Panel,Dialog,Tabset,Tab} from 'eagle-ui';
import {bindingMixin,Toast} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState} from '../utils/utils.es6';
import * as actions from '../actions/index.es6';
import Head from '../components/register/head/Head.jsx';
import RegisterMain from '../components/register/main/RegisterMain.jsx';
import AgentList from '../components/corporation/AgentList.jsx';
import EmployeList from '../components/employe/EmployeList.jsx';
import AgentIndex from '../components/corporation/AgentIndex.jsx';
import Cooperation from '../components/corporation/agentManage/Cooperation.jsx';
import EmployeIndex from '../components/employe/EmployeIndex.jsx';
import Styles from '../less/Common.less';
import '../less/ConfigContainer.less';
import {DataUtil} from '../utils/utils.es6';

@connect(state => ({
    config: state.config,
    fetching: state.fetching,
    dialogConfig: state.dialogConfig
}), actions)
@bindingMixin
export default
class AgentContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {};

    }

    setValueByReducers(key, value) {
        if (key) {
            this.manualChange(key, Immutable.fromJS(value));
        } else {
            console.error('setValueByReducers error', key, value);
        }
    }

    getValueByReducers(key) {
        if (key) {
            const {config} = this.props;
            return getValueBylinkedState(config, key);
        } else {
            console.error('getValueByReducers error', key);
        }
    }

    renderLoadingToast() {
        let toast = null;
        if (this.props.fetching == 1) {
            toast = <Toast>加载中...</Toast>;
        }
        if (this.props.fetching == 2) {
            toast = <Toast>提交中，请稍后...</Toast>;
        }
        return toast;
    }

    showMsgError(content) {
        this.props.setDialog({
            show: true,
            type: 'error',
            content: content,
            showTime: 2000
        });
    }

    showMsgSucc(content) {
        this.props.setDialog({
            show: true,
            type: 'success',
            content: content,
            showTime: 1000
        });
    }

    validate(data) {
        let flag = true, item, v;
        for (let i in data) {
            item = data[i]
            if (item.l) {
                item['v'] = this.getValueByReducers(item.l);
            }
            for (let i in item.m) {
                v = item.m[i];
                if (!DataUtil.validate[i](item.v)) {
                    if (!item.s) {
                        this.showMsgError(item.m[i]);
                    } else {
                        alert(item.m[i]);
                    }
                    flag = false;
                    break;
                }
            }
            if (!flag) {
                break;
            }
        }
        return flag;
    }

    callback(index) {
        if (this.state.tabIndex !== index) {
            this.setState({
                tabIndex: index
            });
            //console.log('callback:', index);
            this.setTabIndexCallback(index);
        }
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
        this.setTabIndexCallback(index);
    }
    setTabIndexCallback(index) {
        const corporationId = this.getValueByReducers('agentListSearch.corporationId');
        if (index == 0) {
            this.setValueByReducers('power.tabType', 0);
            this.loadCorporationList();
        }
        if (index == 1) {
            this.setValueByReducers('power.agentEditor', 0);
        }
        if (index == 2) {
            this.loadOrgCorporation(corporationId);
        }
        if (index == 3) {
            this.loadAllEmployesbyId(corporationId);
        }
        if (index == 1 || index == 2 || index == 3) {
            this.setValueByReducers('power.tabType', 1);
            this.loadAllEmployesbyId(corporationId);
        }
    }
    loadOrgCorporation(corporationId) {
        if(corporationId){
            this.props.loadOrgCorporationbyId(corporationId);
        }
    }
    loadAllEmployesbyId(corporationId) {
        if (corporationId) {
            this.props.loadAllEmployesbyId(corporationId);
        }
    }
    loadCorporationList(){
        const agentListSearch = this.getValueByReducers('agentListSearch').toJS();
        //console.log('agentListSearch', agentListSearch);
        this.searchParam = {
            corporationName: agentListSearch.corporationName,
            approveStatus: agentListSearch.approveStatus,
            cooperationStatus: agentListSearch.cooperationStatus,
            page: agentListSearch.page,
            pageSize: agentListSearch.pageSize
        };
        this.props.loadCorporationList(this.searchParam);
    }

    getDisplay() {
        return this.getValueByReducers('display').toJS();
    }

    render() {
        const tabType = this.getValueByReducers('power.tabType');
        const corporation = this.getValueByReducers('corporation').toJS();
        let dialogCfg = this.props.config.toJS().dialogConfig;
        if (tabType == 0) {
            return (
                <div>
                    {this.renderLoadingToast()}
                    {dialogCfg.show ?
                        <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                    <Panel className="marginTopSpace paddingSpace question-margin configGXIndex">
                        <Tabset disableHoverAnimation={true} activeTab={this.state.tabIndex}
                                tabCallback={::this.callback}>
                            <Tab heading='代理商列表'>
                                <AgentList {...this.props}
                                    validate={::this.validate}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    validate showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    getDisplay={::this.getDisplay}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                        </Tabset>
                    </Panel>
                </div>
            )
        }
        if (tabType == 1) {
            if (corporation && corporation.approveStatus == 1) {
                return (
                    <div>
                        {this.renderLoadingToast()}
                        {dialogCfg.show ?
                            <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                        <Panel className="marginTopSpace paddingSpace question-margin configGXIndex">
                            <Tabset disableHoverAnimation={true} activeTab={this.state.tabIndex}
                                    tabCallback={::this.callback}>
                                <Tab heading='代理商列表'>
                                    <AgentList {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                                <Tab heading='基本信息'>
                                    <AgentIndex {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                                <Tab heading='合作信息'>
                                    <Cooperation {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                                <Tab heading='员工列表'>
                                    <EmployeList {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                            </Tabset>
                        </Panel>
                    </div>
                )
            } else {
                return (
                    <div>
                        {this.renderLoadingToast()}
                        {dialogCfg.show ?
                            <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                        <Panel className="marginTopSpace paddingSpace question-margin configGXIndex">
                            <Tabset disableHoverAnimation={true} activeTab={this.state.tabIndex}
                                    tabCallback={::this.callback}>
                                <Tab heading='代理商列表'>
                                    <AgentList {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                                <Tab heading='基本信息'>
                                    <AgentIndex {...this.props}
                                        validate={::this.validate}
                                        setValueByReducers={::this.setValueByReducers}
                                        getValueByReducers={::this.getValueByReducers}
                                        showMsgError={::this.showMsgError}
                                        showMsgSucc={::this.showMsgSucc}
                                        getDisplay={::this.getDisplay}
                                        setTabIndex={::this.setTabIndex}/>
                                </Tab>
                            </Tabset>
                        </Panel>
                    </div>
                )
            }
        }
        if (tabType == 2) {
            return (
                <div>
                    {this.renderLoadingToast()}
                    {dialogCfg.show ?
                        <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                    <Panel className="marginTopSpace paddingSpace question-margin configGXIndex">
                        <Tabset disableHoverAnimation={true} activeTab={this.state.tabIndex}
                                tabCallback={::this.callback}>
                            <Tab heading='代理商列表'>
                                <AgentList {...this.props}
                                    validate={::this.validate}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    getDisplay={::this.getDisplay}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                            <Tab heading='基本信息'>
                                <AgentIndex {...this.props}
                                    validate={::this.validate}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    getDisplay={::this.getDisplay}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                            <Tab heading='合作信息'>

                            </Tab>
                            <Tab heading='员工列表'>
                                <EmployeList {...this.props}
                                    validate={::this.validate}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    getDisplay={::this.getDisplay}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                            <Tab heading='员工信息'>
                                <EmployeIndex {...this.props}
                                    validate={::this.validate}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    getDisplay={::this.getDisplay}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                        </Tabset>
                    </Panel>
                </div>
            )
        }
        return (
            <div></div>
        );
    }
}