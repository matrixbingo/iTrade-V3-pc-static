import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Select,CalendarPanel,Input} from 'eagle-ui';
import {CalendarPanelPlus, InputPlus, SelectPlus, TextArea, RadioPlus} from '../../utils/index.jsx';
import Styles from './AgentEditor.less';
import LabelWarn from './../LabelWarn.jsx';
import {DataUtil} from '../../../utils/utils.es6';

export default class AgentEditor extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            corporationNameWarn: ''
        };
        this.props.loadProvinceList();
    }

    chooseProvince(value, key, type) {
        let corporation = this.props.getValueByReducers('corporation').toJS();
        corporation.provinceId = value
        corporation.cityId = 0;
        this.props.setValueByReducers('corporation', corporation);
        if (this.refs.selectPlusCity) {
            this.refs.selectPlusCity.cleanName();
        }
        this.props.loadCityListByProvinceId(value);
    }

    onBlurCallback() {
        const corporationName = this.props.getValueByReducers('corporation.corporationName');
        if (corporationName && corporationName.length > 0) {
            this.props.loadCorporationByCorporationName(corporationName, this, this.onBlurCallbackCallback);
        }
    }

    onBlurCallbackCallback(_this, data) {
        if (data && data.code == 200 && data.msg == true) {
            _this.setState({corporationNameWarn: '此企业名称已经存在'})
        } else {
            _this.setState({corporationNameWarn: ''})
        }
    }

    onRegisteredCapitalBlurCallback(_this, val) {
        let registeredCapital = _this.props.getValueByReducers('corporation.registeredCapital');
        registeredCapital = DataUtil.format.currency(registeredCapital);
        _this.props.setValueByReducers('corporation.registeredCapital', registeredCapital);
    }

    hasTeamCallback(e){
        if(e == 'false'){
            this.props.setValueByReducers('corporation.teamPeople', '');
        }
    }

    hasOfficeCallback(e){
        if(e == 'false'){
            let corporation = this.props.getValueByReducers('corporation').toJS();
            corporation.officeAddress='';
            corporation.officeSize=0;
            corporation.hasOffice = false;
            this.props.setValueByReducers('corporation', corporation);
        }
    }

    render() {
        const star = <span className="redFont">*</span>;
        const provinceList = this.props.getValueByReducers('provinceList').toJS();
        const cityList = this.props.getValueByReducers('cityList').toJS();
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const corporation = this.props.getValueByReducers('corporation').toJS();
        //console.log('corporation', corporation.hasTeam, corporation.hasOffice);
        return (
            <div className="agentEditor">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业名称:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onBlurCallback={::this.onBlurCallback}
                                   valueLink='corporation.corporationName' placeholder='请填写营业执照上的企业名称'/>
                    </Col>
                </Row>
                <LabelWarn title={this.state.corporationNameWarn}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   valueLink='corporation.corporationAddress' placeholder='请填写公司注册地址'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}合作城市:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <Col sm={6} className="end-col-select select-col" end>
                            <SelectPlus list={provinceList}
                                        config={this.props.config}
                                        param={{id:'provinceId', name:'provinceName'}}
                                        defaultId={corporation.provinceId}
                                        defaultName={corporation.provinceName}
                                        valueLink='corporation.provinceId'
                                        getValueCallback={::this.chooseProvince}
                                        placeholder="请选择省份"/>
                        </Col>
                        <Col sm={6} className="city select-col">
                            <SelectPlus ref='selectPlusCity'
                                        list={cityList}
                                        config={this.props.config}
                                        defaultName={corporation.cityName}
                                        valueLink='corporation.cityId'
                                        param={{id:'cityId', name:'cityName'}}
                                        placeholder="请选择城市"/>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业性质:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus list={defaultDara.corporationTypeEum}
                                    config={this.props.config}
                                    defaultId={corporation.corporationType}
                                    valueLink='corporation.corporationType'
                                    placeholder="请选择企业性质"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}成立时间:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <CalendarPanelPlus startDate="1900-01-01"
                                           valueLink='corporation.foundingTime'
                                           defaultDate={corporation.foundingTime}
                                           config={this.props.config} placeholder="请选择公司成立时间"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}注册资金:</span>
                    </Col>
                    <Col sm={8} className="capital-col" end>
                        <InputPlus config={this.props.config} {...this.props}
                                   validRules={{maxLength:10,isInt:true}}
                                   onBlurCallback={this.onRegisteredCapitalBlurCallback}
                                   valueLink='corporation.registeredCapital'/>
                        <span className="capital-span-right">元</span>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}财务状况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus list={defaultDara.financialSituationEum}
                                    config={this.props.config}
                                    defaultName={corporation.financialSituation}
                                    valueLink='corporation.financialSituation'
                                    placeholder="请选财务状况"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}是否有团队:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   config={this.props.config}
                                   list={defaultDara.hasTeamEum}
                                   defaultId={corporation.hasTeam}
                                   getValueCallback={::this.hasTeamCallback}
                                   valueLink='corporation.hasTeam'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasTeam?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}团队人数:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onBlurCallback={::this.onBlurCallback}
                                   validRules={{isInt:true,maxLength:8}}
                                   valueLink='corporation.teamPeople' placeholder='请填写团队人数！'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室情况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   config={this.props.config}
                                   list={defaultDara.hasOfficeEum}
                                   defaultId={corporation.hasOffice}
                                   getValueCallback={::this.hasOfficeCallback}
                                   valueLink='corporation.hasOffice'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onBlurCallback={::this.onBlurCallback}
                                   valueLink='corporation.officeAddress' placeholder='请填写办公室地址！'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室面积:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   validRules={{maxLength:10,isInt:true}}
                                   onBlurCallback={::this.onBlurCallback}
                                   valueLink='corporation.officeSize' placeholder='请填写办公室面积(平方米)！'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">其他信息:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <TextArea {...this.props} rows={4}
                                                  valueLink='corporation.remark'
                                                  placeholder="如有其他信息，请填写，例如申请理由，公司优势等"/>
                    </Col>
                </Row>
            </div>);
    }
}