import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Select,CalendarPanel,Input} from 'eagle-ui';
import {CalendarPanelPlus, InputPlus, SelectPlus, TextArea, RadioPlus} from '../../utils/index.jsx';
import Styles from './AgentEditor.less';
import LabelWarn from './../LabelWarn.jsx';
import {DataUtil} from '../../../utils/utils.es6';

export default class AgentView extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            corporationNameWarn: ''
        };
    }

    render() {
        const provinceList = this.props.getValueByReducers('provinceList');
        const cityList = this.props.getValueByReducers('cityList');
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const registeredCapital = DataUtil.format.currency(corporation.registeredCapital) + '元';
        //console.log('corporation', corporation);
        return (
            <div className="agentEditor">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">企业名称:</span>
                    </Col>
                    <Col sm={8} className="end-col" end style={{padding: '12px 0px 12px 15px', fontSize: '16px'}}>
                        <InputPlus viewOnly={true}
                                   span={true}
                                   config={this.props.config}
                                   valueLink='corporation.corporationName'/>
                    </Col>
                </Row>
                <LabelWarn title={this.state.corporationNameWarn}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">企业地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end style={{padding: '12px 0px 12px 15px', fontSize: '16px'}}>
                        <InputPlus viewOnly={true}
                                   span={true}
                                   config={this.props.config}
                                   valueLink='corporation.corporationAddress'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">合作城市:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true}
                                   config={this.props.config}
                                   defaultValue={corporation.provinceName + ' - ' + corporation.cityName}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">企业性质:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus viewOnly={true} list={defaultDara.corporationTypeEum}
                                    config={this.props.config}
                                    valueLink='corporation.corporationType'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">成立时间:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <CalendarPanelPlus viewOnly={true}
                                           startDate="1900-01-01"
                                           valueLink='corporation.foundingTime'
                                           config={this.props.config} placeholder="请选择公司成立时间"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">注册资金:</span>
                    </Col>
                    <Col sm={8} className="capital-col" style={{float:'left'}}>
                        <InputPlus viewOnly={true}
                                   defaultValue={registeredCapital}
                                   style={{width: '60%'}}
                                   className="capital-input"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">财务状况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus viewOnly={true}
                                    config={this.props.config}
                                    valueLinkName='corporation.financialSituation'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">是否有团队:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   viewOnly={true}
                                   config={this.props.config}
                                   list={defaultDara.hasTeamEum}
                                   defaultId={corporation.hasTeam}/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasTeam?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">团队人数:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true}
                                   config={this.props.config}
                                   valueLink='corporation.teamPeople'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">办公室情况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   viewOnly={true}
                                   config={this.props.config}
                                   list={defaultDara.hasOfficeEum}
                                   defaultId={corporation.hasOffice}/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">办公室地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end style={{padding: '12px 0px 12px 15px', fontSize: '16px'}}>
                        <InputPlus viewOnly={true}
                                   span={true}
                                   config={this.props.config}
                                   valueLink='corporation.officeAddress'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">办公室面积:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true}
                                   config={this.props.config}
                                   defaultValue={corporation.officeSize+ '(平方米)'}
                                   valueLink='corporation.officeSize'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">其他信息:</span>
                    </Col>
                    <Col sm={8} className="end-col" style={{padding:'8px'}} end>
                        <TextArea viewOnly={true} {...this.props} rows={4}
                                  defaultValue={corporation.remark ? corporation.remark:'无'} />
                    </Col>
                </Row>
            </div>);
    }
}