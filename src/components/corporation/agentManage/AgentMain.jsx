import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,Button,FormGroup} from 'eagle-ui';
import {TextArea} from '../../utils/index.jsx';
import TitleRight from './TitleRight.jsx';
import ContactItem from './ContactItem.jsx';
import AgentEditor from './AgentEditor.jsx';
import AgentView from './AgentView.jsx';
import Styles from './AgentMain.less';
import {DataUtil} from '../../../utils/utils.es6';
import {validateType} from '../../../constants/validate-type.es6';

export default class AgentMain extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            approveStatus: 1, //1 审核通过 2 驳回
            agentInfoView: true
        };
    }

    updateCorporation() {
        if (!this.props.validate(validateType.updateCorporation)) {
            return;
        }
        let corporation = this.props.getValueByReducers('corporation').toJS();
        let oCorporation = this.props.getValueByReducers('oCorporation').toJS();
        const updateCorporation = this.props.getValueByReducers('updateCorporation').toJS();

        corporation = DataUtil.transfor(updateCorporation, corporation);
        oCorporation = DataUtil.transfor(updateCorporation, oCorporation);

        //console.log(oCorporation, corporation);
        if (DataUtil.isEqual(corporation, oCorporation)) {
            this.props.showMsgError('请修改代理商信息再提交!');
            return;
        }

        if ((corporation.registeredCapital + '').indexOf(',') > -1) {
            corporation.registeredCapital = corporation.registeredCapital.replace(/,/g, '');
        }
        if (corporation.foundingTime.length == 10) {
            corporation.foundingTime = corporation.foundingTime + ' 00:00:00';
        }

        console.log('更新代理商', corporation);
        this.props.updateCorporation(corporation);
    }

    updateContact() {
        let contact = this.props.getValueByReducers('contact').toJS();
        let oContact = this.props.getValueByReducers('oContact').toJS();
        const updateContact = this.props.getValueByReducers('updateContact').toJS();
        contact = DataUtil.transfor(updateContact, contact);
        oContact = DataUtil.transfor(updateContact, oContact);
        if (DataUtil.isEqual(contact, oContact)) {
            this.props.showMsgError('请修改代理商信息再提交!');
            return;
        }
        console.log('更新联系人', contact);
        this.props.updateContact(contact);
    }

    editor() {
        this.props.setValueByReducers('power.agentEditor', 1);
        this.setState({
            agentInfoView: false
        })
    }

    getAgentInfo() {
        if (this.state.agentInfoView) {
            return <AgentView {...this.props}/>;
        } else {
            return <AgentEditor {...this.props}/>;
        }
    }

    approve(type) {
        if (type == 1) {  //通过
            this.setState({
                approveStatus: 1,
                title: '请填写通过原因',
                label: '通过原因'
            });

        } else { //驳回
            this.setState({
                approveStatus: 2,
                title: '请填写驳回原因',
                label: '驳回原因'
            });
        }
        this.dialogMask('approveEditorDialog');
    }

    dialogMask(id) {
        Dialog.mask(id).then(function () {
            Dialog.close();
        }, function (type) {
        });
    }

    updateCorporationApproveStatus() {
        let agentListSearch = this.props.getValueByReducers('agentListSearch').toJS();
        let approveStatus = this.props.getValueByReducers('approveStatus').toJS();
        approveStatus.corporationId = agentListSearch.corporationId;
        approveStatus.status = this.state.approveStatus;
        console.log('更新公司审核状态:', approveStatus);
        this.props.updateCorporationApproveStatus(approveStatus);
        Dialog.close();
        this.props.setTabIndex(0);
    }

    approveEditorDialog() {
        const _this = this;
        return (<Dialog id="approveEditorDialog" egSize="sm" title={_this.state.title} style={{width:'630px'}} buttons={[
                    {
                        egStyle:'info',
                        name:'确定',
                        callback:()=>{_this.updateCorporationApproveStatus()}
                    },
                    {
                        type:'cancel',
                        egStyle:'white',
                        name:'取消',
                        callback:()=>{}
                    }
                    ]}>
            <Grid style={{overflowX:'hidden',overflowY:'scroll',height:'111px'}}>
                <FormGroup>
                    <Row>
                        <Col sm={3}>{_this.state.label}</Col>
                        <Col sm={8}>
                            <TextArea {...this.props} rows={4} valueLink='approveStatus.approveRemark'
                                                      placeholder={'请填写' + _this.state.label}/>
                        </Col>
                        <Col sm={1}></Col>
                    </Row>
                </FormGroup>
            </Grid>
        </Dialog> )
    }


    render() {
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const agentEditor = this.props.getValueByReducers('power.agentEditor');
        return (
            <div className="agentMain">
                {this.approveEditorDialog()}
                <Row style={{display:agentEditor==0 && corporation.approveStatus ==0?'block':'none'}}>
                    <Col sm={2}>
                        <Button egSize="sm" block onClick={::this.editor}>编辑基本信息</Button>
                    </Col>
                    <Col sm={4}></Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col sm={12} style={{textAlign:'center', paddingTop: '30px'}}>
                        <h3></h3>
                    </Col>
                </Row>
                <TitleRight title="公司信息"/>
                {this.getAgentInfo()}
                <Row style={{display:agentEditor==0?'none':'block'}}>
                    <Col sm={4}></Col>
                    <Col sm={4} style={{paddingLeft: '0px'}}>
                        <Button radius egSize="sm" block onClick={::this.updateCorporation}>保存公司信息</Button>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <TitleRight title="联系人信息"/>
                <ContactItem contactItemViewOnly={this.state.agentInfoView} {...this.props}/>
                <Row>
                    <Col sm={12}></Col>
                </Row>
                <Row style={{display:agentEditor==0?'none':'block'}}>
                    <Col sm={4}></Col>
                    <Col sm={4} style={{paddingLeft: '0px'}}>
                        <Button radius egSize="sm" block onClick={::this.updateContact}>保存联系人信息</Button>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
                <Row>
                    <Col sm={12}></Col>
                </Row>
                <Row style={{display:agentEditor==0 && corporation.approveStatus ==0?'block':'none'}}>
                    <Col sm={8}></Col>
                    <Col sm={1} style={{position: 'fixed',right:'300px', bottom: '60px', width: '120px'}}>
                        <Button radius egSize="sm" block onClick={::this.approve.bind(this, 1)}>通过审核</Button>
                    </Col>
                    <Col sm={1} style={{position: 'fixed',right:'174px', bottom: '60px', width: '120px'}}>
                        <Button radius egSize="sm" block egStyle="white"
                                onClick={::this.approve.bind(this, 2)}>驳回</Button>
                    </Col>
                    <Col sm={2}></Col>
                </Row>
            </div>);
    }
}