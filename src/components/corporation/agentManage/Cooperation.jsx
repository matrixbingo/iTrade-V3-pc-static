import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,Button,FormGroup,Toast} from 'eagle-ui';
import {InputPlus,SelectPlus,DropDownSuggestion} from '../../utils/index.jsx';
import TitleRight from './TitleRight.jsx';
import ContactItem from '../../contact/ContactItem.jsx';
import AgentEditor from './AgentEditor.jsx';
import AgentView from './AgentView.jsx';
import Styles from './AgentEditor.less';
import {DataUtil} from '../../../utils/utils.es6';
import {validateType} from '../../../constants/validate-type.es6';

export default class Cooperation extends Component {

    constructor(props, context) {
        super(props, context);
        this.getUserUrl = '/apollo/agent/user/search';
        this.getOrgUrl = '/apollo/agent/org/search';
        this.state = {
            approveStatus: 1, //1 审核通过 2 驳回
            stopCooperation:false,
            agentInfoView: true,
            dialog:{
                type:1, // 1:设定部门 2:停止合作
                dialogID:"editorOrgDialog",
                title: '设定部门'
            },
            toast: {
                type: 'loading',
                isMask: true,
                message: '关系绑定中，请耐心等候...',
                seconds: 2
            },
        };
    }

    showLoading(type) {
        if (type === 1) {
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
        this.props.setValueByReducers('power.agentEditor', 1);
        this.setState({
            agentInfoView: false
        })
    }

    getDialogInfoByType(type){
        let info = {id :'editorOrgDialog', title:'设定所属部门'}
        if(type == 2){
            info.id = 'stopCooperation';
            info.title = '停止合作';
        }
        return info;
    }

    showDialog(type) {
        const info = this.getDialogInfoByType(type);
        this.setState({
            dialog:{
                title:info.title,
                id:info.id,
                type:type // 1:设定部门 2:停止合作
            }
        });
        this.dialogMask('editorOrgDialog');
    }

    dialogMask(id) {
        Dialog.mask(id).then(function () {
            Dialog.close();
        }, function (type) {
        });
    }

    submit(){
        if(this.state.dialog.type ==1){
           this.updateCorporationOrg();
        }else{
            this.stopCooperation();
        }
    }
    updateCorporationOrg() {
        const corporation = this.props.getValueByReducers('corporation').toJS();
        let cooperation = this.props.getValueByReducers('cooperation').toJS();
        const manager = this.props.getValueByReducers('managerName').toJS();
        const oManager = this.props.getValueByReducers('oManagerName')?this.props.getValueByReducers('oManagerName').toJS():{};
        const org = this.props.getValueByReducers('organization').toJS();
        const oOrg = this.props.getValueByReducers('oOrganization')?this.props.getValueByReducers('oOrganization').toJS():{};
        const data = [
            {v: manager.loginId, m: {required: '请选代理商公司负责人!'},s: true},
            {v: org.organizationId, m: {required: '请选择部门!'}, s: true}
        ];
        Dialog.close();
        if (!this.props.validate(data)) {
            return;
        }
        if(manager.loginId == oManager.loginId && org.organizationId == oOrg.organizationId){
            alert('请修改设置再提交');
            return;
        }

        if (!cooperation.parentOrgName && corporation.cooperationStatus == 0) {
            console.log('新增公司与组织的绑定关系:', corporation.corporationId, org.organizationId, manager.loginId);
            this.showLoading(1);
            this.timeHanderNo = 0;
            this.props.addCorporationCoorporation(corporation.corporationId, org.organizationId, manager.loginId, this, this.addCorporationCoorporationCallback);
        }
        if (cooperation.parentOrgName ) {
            console.log('更新公司与组织的绑定关系:', corporation.corporationId, org.organizationId, manager.loginId);
            this.props.updateCorporationCoorporation(corporation.corporationId, org.organizationId, manager.loginId, this, this.loadCooperation);
        }
    }

    addCorporationCoorporationCallback(_this, data) {
        const corporation = _this.props.getValueByReducers('corporation').toJS();
        _this.timeHander = window.setInterval(function () {
            if(_this.timeHanderNo < 10){
                _this.props.loadOrgCorporationbyIdInterval(4, _this, _this.loadOrgCorporationbyIdIntervalCallback);
            }else{
                _this.props.loadOrgCorporationbyIdInterval(corporation.corporationId, _this, _this.loadOrgCorporationbyIdIntervalCallback);
            }
            _this.timeHanderNo++;
        }, 300)
    }

    loadOrgCorporationbyIdIntervalCallback(_this, data) {
        if (data.msg && data.msg.corporationId) {
            Dialog.close();
            const corporation = _this.props.getValueByReducers('corporation').toJS();
            _this.props.showMsgSucc('绑定成功!');
            _this.timeHander && window.clearInterval(_this.timeHander);
            _this.props.loadOrgCorporationbyId(corporation.corporationId);
            _this.props.loadCorporationbyId(corporation.corporationId);
        }
    }

    loadCooperation(_this, data) {
        _this.props.loadOrgCorporationbyId(data.msg.corporationId);
    }

    createOrgEdit(){
        const managerName = this.props.getValueByReducers('managerName').toJS();
        const organization = this.props.getValueByReducers('organization').toJS();
        const star = <span className="redFont">*</span>;
       return (<FormGroup>
            <Row>
                <Col sm={4}>{star}代理商公司名称:</Col>
                <Col sm={7}>
                    <InputPlus {...this.props} viewOnly={true} valueLink='corporation.corporationName'/>
                </Col>
                <Col sm={1}></Col>
            </Row>
            <Row>
                <Col sm={4}>{star}代理商公司负责人:</Col>
                <Col sm={7} className="end-col" end>
                    <div style={{fontSize:'12px',verticalAlign:'top'}}>
                        <DropDownSuggestion url={this.getUserUrl}  {...this.props}
                                            format={{leng: 50, title: {'employeeName': ' - ', 'ad': ' - ', 'organizationName': ''}}}
                                            initData={managerName}
                                            valueLink='managerName'
                                            placeholder="请输入汇报人姓名"/>
                    </div>
                </Col>
                <Col sm={1}></Col>
            </Row>
            <Row>
                <Col sm={4}>{star}所属部门:</Col>
                <Col sm={7} className="end-col" end>
                    <div style={{fontSize:'12px',verticalAlign:'top'}}>
                        <DropDownSuggestion url={this.getOrgUrl} {...this.props}
                                            format={{leng: 50, title: {'organizationName': ''}}}
                                            initData={organization}
                                            valueLink='organization'
                                            placeholder="请输入所属部门"/>
                    </div>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </FormGroup>);
    }

    createStopCooperation() {
        return (<Row>
            <Col sm={12}>请确认是否停止合作</Col>
            </Row>);
    }

    orgEditorDialog() {
        const _this = this;
        const managerName = this.props.getValueByReducers('managerName').toJS();
        const organization = this.props.getValueByReducers('organization').toJS();
        let  width = '630px', height = '111px';

        if(this.state.dialog.type == 2){
            width = '350px', height = '40px';
        }
        //console.log(managerName, organization);
        return (<Dialog id="editorOrgDialog" egSize="sm" title={_this.state.dialog.title} style={{width:width}} buttons={[
            {
                egStyle:'info',
                name:'确定',
                callback:()=>{_this.submit()}
            },
            {
                type:'cancel',
                egStyle:'white',
                name:'取消',
                callback:()=>{}
            }
        ]}>
            <Grid style={{height:height}}>
                {this.state.dialog.type == 1?this.createOrgEdit():this.createStopCooperation()}
            </Grid>
        </Dialog> )
    }

    getCooperationStatus(cooperationStatus){
      switch (cooperationStatus){
          case 0: return '未合作';
          case 1: return '已合作';
          case 2: return '停止合作';
      }
    }

    stopCooperation() {
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const corporationId = corporation.corporationId;
        this.props.deleteCorporationOrg(corporationId, this, function (_this) {
            _this.props.loadCorporationbyId(corporationId, _this, null)
        });
        Dialog.close();
    }

    render() {
        const _this = this;
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const cooperation = this.props.getValueByReducers('cooperation').toJS();
        const cooperationStatus = this.getCooperationStatus(corporation.cooperationStatus);
        return (
            <div className="agentEditor">
                <Dialog id="toast" isClose={false} isMaskClose={false} isMask={this.state.toast.isMask}>
                    <Toast type={this.state.toast.type}
                           seconds={this.state.toast.seconds}>{this.state.toast.message}</Toast>
                </Dialog>
                {this.orgEditorDialog()}
                <Row style={{display:(corporation.approveStatus ==1 && (corporation.cooperationStatus == 0 || corporation.cooperationStatus == 1))?'block':'none'}}>
                    <Col sm={2}>
                        <Button egSize="sm" block onClick={::this.showDialog.bind(_this, 1)}>设定部门</Button>
                    </Col>
                    <Col sm={2} style={{display:corporation.cooperationStatus ==1?'block':'none'}}>
                        <Button egSize="sm" block onClick={::this.showDialog.bind(_this, 2)}>停止合作</Button>
                    </Col>
                    <Col sm={6}></Col>
                </Row>
                <Row>
                    <Col sm={12} style={{textAlign:'center'}}>
                        <h3>{corporation.corporationName}</h3>
                    </Col>
                </Row>
                <TitleRight title="合作信息"/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">合作状态:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true} config={this.props.config}
                                   defaultValue={cooperationStatus}
                                   placeholder='未合作'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">代理商所属部门:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true} config={this.props.config}
                                   defaultValue={cooperation.parentOrgName}
                                   valueLink='cooperation.parentOrgName'
                                   placeholder='未设置（设定部门才能开始合作)'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">代理商负责人:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true} config={this.props.config}
                                   defaultValue={cooperation.managerName}
                                   valueLink='cooperation.managerName'
                                   placeholder='未设置'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}></Col>
                </Row>
            </div>
        )
    }
}