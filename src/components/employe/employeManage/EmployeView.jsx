import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Select,CalendarPanel,Input} from 'eagle-ui';
import {CalendarPanelPlus, InputPlus, SelectPlus, TextArea, RadioPlus} from '../../utils/index.jsx';
import Styles from './EmployeEditor.less';
import {DataUtil} from '../../../utils/utils.es6';

export default class EmployeView extends Component {

    static defaultProps = {
        agentViewDisabled: true
    }

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    render() {
        const star = <span className="redFont"></span>;
        const provinceList = this.props.getValueByReducers('provinceList');
        const cityList = this.props.getValueByReducers('cityList');
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const registeredCapital = DataUtil.format.currency(corporation.registeredCapital) + '元';

        return (
            <div className="employeEditor">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业名称:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={this.state.agentViewDisabled}
                                   config={this.props.config}
                                   valueLink='corporation.corporationName'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={this.state.agentViewDisabled}
                                   config={this.props.config}
                                   valueLink='corporation.corporationAddress'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}合作城市:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <Col sm={6} className="end-col-select" end>
                            <SelectPlus viewOnly={this.state.agentViewDisabled}
                                        config={this.props.config}
                                        valueLinkName='corporation.provinceName'/>
                        </Col>
                        <Col sm={6} className="city">
                            <SelectPlus viewOnly={this.state.agentViewDisabled}
                                        config={this.props.config}
                                        valueLinkName='corporation.cityName'/>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业性质:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus viewOnly={this.state.agentViewDisabled} list={defaultDara.corporationTypeEum}
                                    config={this.props.config}
                                    valueLink='corporation.corporationType'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}成立时间:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <CalendarPanelPlus viewOnly={this.state.agentViewDisabled}
                                           startDate="1900-01-01"
                                           valueLink='corporation.foundingTime'
                                           defaultDate={this.state.corporationInfoDate}
                                           config={this.props.config} placeholder="请选择公司成立时间"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}注册资金:</span>
                    </Col>
                    <Col sm={8} className="capital-col">
                        <InputPlus viewOnly={this.state.agentViewDisabled}
                                   defaultValue={registeredCapital}
                                   style={{width: '60%'}}
                                   className="capital-input"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}财务状况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus viewOnly={this.state.agentViewDisabled}
                                    config={this.props.config}
                                    valueLinkName='corporation.financialSituation'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}是否有团队:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   viewOnly={this.state.agentViewDisabled}
                                   config={this.props.config}
                                   list={defaultDara.hasTeamEum}
                                   defaultId={this.state.defaultHasTeam}
                                   valueLink='corporation.hasTeam'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室情况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   viewOnly={this.state.agentViewDisabled}
                                   config={this.props.config}
                                   list={defaultDara.hasOfficeEum}
                                   defaultId={this.state.defaultHasOffice}
                                   valueLink='corporation.hasOffice'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}其他信息:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <TextArea viewOnly={this.state.agentViewDisabled} {...this.props} rows={4}
                                  valueLink='corporation.remark'
                                  placeholder="如有其他信息，请填写，例如申请理由，公司优势等"/>
                    </Col>
                </Row>
            </div>);
    }
}