import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,Button,Toast} from 'eagle-ui';
import EmployeEditor from './EmployeEditor.jsx';
import Styles from './EmployeMain.less';
import {DataUtil} from '../../../utils/utils.es6';
import {validateType} from '../../../constants/validate-type.es6';

export default class EmployeMain extends Component {

    constructor(props, context) {
        super(props, context);

        this.addEmp = true;
        this.state = {
            toast: {
                type: 'loading',
                isMask: true,
                message: '账号创建中，请耐心等候...',
                seconds: 6000000

            }
        };
    }

    showLoading(type) {
        if (type == 1) {
            Dialog.mask('toast').then(function () {
                console.dir('...alert....');
                Dialog.close();
            }, function (type) {
                console.dir(type);
            });
        } else {
            Dialog.close();
        }
    }

    editor() {
        let employee = this.props.getValueByReducers('employee').toJS();
        const reportEmploye = this.props.getValueByReducers('employeeEnditorPage.reportEmploye').toJS();
        const editorType = this.props.getValueByReducers('employeEditorPage.editorType');
        const corporationId = this.props.getValueByReducers('agentListSearch.corporationId');
        employee.reportLoginId = reportEmploye.loginId;

        console.log('新建员工', employee);
        if (!this.props.validate(validateType.addEmploye)){
            return;
        }
        if (editorType == 0) {
            this.showLoading(1);
            /*if(!this.addEmp){
                alert('请勿反复新建！');
                return;
            }*/
            const addEmploye = this.props.getValueByReducers('addEmploye').toJS();
            employee = DataUtil.transfor(addEmploye, employee);
            //this.addEmp = false;
            this.props.addEmploye(corporationId, employee, this, this.addEmployeCallback);
            console.log('新建员工', employee);
        } else {
            const updateEmploye = this.props.getValueByReducers('updateEmploye').toJS();
            let oEmployee = this.props.getValueByReducers('oEmployee').toJS();
            employee = DataUtil.transfor(updateEmploye, employee);
            oEmployee = DataUtil.transfor(updateEmploye, oEmployee);
            if(DataUtil.isEqual(employee,oEmployee)){
                this.props.showMsgError('请修改员工信息再提交!');
                return;
            }
            console.log('更新员工', employee);
            this.props.updateEmploye(corporationId, employee, this, function(_this, data){
                _this.props.setTabIndex(3);
            });
        }
    }

    addEmployeCallback(_this, data) {
        if (data.msg && data.msg.loginId) {
            _this.timeHander = window.setInterval(function () {
                _this.props.loadEmployebyLoginIdInterval(data.msg.loginId, _this, _this.loadEmployebyLoginIdCallback);
            }, 800)
        }
    }

    loadEmployebyLoginIdCallback(_this, data) {
        if (data.msg && data.msg.loginId) {
            Dialog.close();
            _this.props.showMsgSucc('用户创建成功!');
            _this.timeHander && window.clearInterval(_this.timeHander);
            setTimeout(function () {
                _this.props.setTabIndex(3);
            }, 200);
        }
    }

    getTypeName() {
        const editorType = this.props.getValueByReducers('employeEditorPage.editorType');
        if (editorType == 0) {
            return '新建员工';
        } else {
            return '更新员工';
        }
    }

    render() {
        return (
            <div className="employeMain">
                <Dialog id="toast" isClose={false} isMaskClose={false} isMask={this.state.toast.isMask}>
                <Toast type={this.state.toast.type}
                       seconds={this.state.toast.seconds}>{this.state.toast.message}</Toast>
            </Dialog>
                <Row>
                    <Col sm={12} style={{textAlign:'center'}}>
                        <h3></h3>
                    </Col>
                </Row>
                <EmployeEditor {...this.props}/>
                <Row>
                    <Col sm={12}></Col>
                </Row>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4} style={{paddingLeft: '0px'}}>
                        <Button radius egSize="sm" block onClick={::this.editor}>{this.getTypeName()}</Button>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col sm={12}></Col>
                </Row>
            </div>);
    }
}