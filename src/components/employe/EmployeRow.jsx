/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Button,Dialog,Grid,FormGroup} from 'eagle-ui';
import Styles from './EmployeRow.less';
import classNames from 'classnames';
import {setTab, getRootPath} from '../../utils/utils.es6';
import {getEum} from '../utils/agent/agentUtils.es6';

export default class EmployeRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.id = 0;
        this.state = {};

    }

    editorEmploye(id, provinceId) {
        //const agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        //this.props.loadOrgCorporationbyId(agentListSearch.corporationId);
        this.props.setValueByReducers('employeEditorPage.editorType', 1);
        this.props.setValueByReducers('employeSearchData.loginId', id);
        this.props.loadEmployebyLoginId(id);
        this.props.loadCityListByProvinceId(provinceId);
        this.props.setValueByReducers('power.tabType', 2);
        this.props.setTabIndex(4);
    }

    handleLeaveDialog(){
        let _this = this;
        return this.state.leaveState?<Dialog id="handleLeave" egSize="sm" title="离职确认" style={{width:'350px'}} buttons={[
            {
                egStyle:'info',
                name:'确认',
                callback:()=>{_this.handelEmployeeLeave()}
            },
            {
                type:'cancel',
                egStyle:'white',
                name:'取消',
                callback:()=>{}
            }
        ]}>
            <Grid>
                <Row>
                    <Col sm={12}>请确认是否离职</Col>
                </Row>
                <Row></Row>

            </Grid>

        </Dialog>:null;
    }

    showHandleLeaveDialog(id){

        this.id = id;
        this.setState({
            leaveState: true
        });

        this.props.setValueByReducers('leaveEmployeeId',id);

        Dialog.mask('handleLeave').then(function () {
            Dialog.close();
        }, function (type) {

        });
    }

    handelEmployeeLeave(){
        const employeeId = this.props.getValueByReducers('leaveEmployeeId');
        this.props.deleteEmployee(employeeId, this, function (_this) {
            const id = _this.props.getValueByReducers('corporation').toJS().corporationId;
            _this.props.loadAllEmployesbyId(id);
        });
        Dialog.close();
    }

    getEmployeeStatus(status){

        if(status == 0){
            return "在职";
        }

        if(status == 1){
            return "已离职";
        }
    }

    render() {
        const _this = this;
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const list = this.props.list;
        let rowNo = 1;
        let display = 'block';

        return (
            <div className="employeRow">
                {this.handleLeaveDialog()}
                {
                    list && list.map((ele)=> {
                        let rowColor = rowNo % 2 == 0 ? 'row-color-odd' : 'row-color-eve';
                        rowNo++;
                        return <Row className={rowColor}>
                            <Col sm={1} className="text-align-center">
                                <Col sm={12} className="employeename">
                                    <Button block radius egSize="sm" egStyle="link" >{ele.get('name')}</Button>
                                </Col>
                            </Col>
                            <Col sm={2} className="text-align-center padding-top-20">
                                {ele.get('ad')}
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {ele.get('reportEmployeeName')}
                            </Col>
                            <Col sm={2} className="text-align-center padding-top-20">
                                {ele.get('idCard')}
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {ele.get('cityName')}
                            </Col>
                            <Col sm={2} className="text-align-center padding-top-20">
                                {ele.get('mobile')}
                            </Col>
                            <Col sm={1} className="text-align-center padding-top-20">
                                {this.getEmployeeStatus(ele.get('terminated'))}
                            </Col>
                            <Col sm={2} className="text-align-center" style={{display:ele.get('terminated')== 0?'block':'none'}}>
                                <Button style={{display: 'inline-block', width: '50px', padding: '0', marginTop: '13px', color: '#ee5511'}} block radius egSize="sm" egStyle="link" onClick={this.editorEmploye.bind(_this, ele.get('loginId'), ele.get('provinceId'))}>编辑</Button>
                                <Button style={{display: 'inline-block', width: '50px', padding: '0', margin: '13px 0 0 10px', color: '#ee5511'}} block radius egSize="sm" egStyle="link" onClick={this.showHandleLeaveDialog.bind(_this, ele.get('loginId'))}>离职</Button>
                            </Col>
                        </Row>
                    })
                }
            </div>
        );
    }
}