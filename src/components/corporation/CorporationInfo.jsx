import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Select,CalendarPanel,Input} from 'eagle-ui';
import {CalendarPanelPlus,  SelectPlus, TextArea, RadioPlus, validateType, RadioOrig, InputPlus} from '../utils/index.jsx';
import Styles from './CorporationInfo.less';
import LabelWarn from './LabelWarn.jsx';
import {DataUtil} from '../../utils/utils.es6';
import TitleRight from '../register/main/TitleRight.jsx';

export default class CorporationInfo extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            corporationType: '',
            corporationNameWarn: ''
        };
        this.props.loadProvinceList();
    }

    chooseProvince(value, key, type, _this) {
        const provinceList = this.props.getValueByReducers('provinceList').toJS();
        if((provinceList && provinceList.length == 0) || !provinceList){
            this.props.loadProvinceList();
        }
        //console.log('provinceList.length : ' + provinceList.length)
        let corporation = this.props.getValueByReducers('corporation').toJS();
        corporation.provinceId = value
        corporation.cityId = 0;
        this.props.setValueByReducers('corporation', corporation);
        if (this.refs.selectPlusCity) {
            this.refs.selectPlusCity.cleanName();
        }
        this.chooseSelectWarn(value, key, type, _this);
        this.props.loadCityListByProvinceId(value);
    }

    onBlurCallback(input, value) {
        if (input.props.valueLink == 'corporation.corporationName') {
            if (value && value.length > 0) {
                this.props.loadCorporationByCorporationName(value, this, this.onBlurCallbackCallback);
            }
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
        registeredCapital = registeredCapital.replace(/,/g, '');
        registeredCapital = DataUtil.format.currency(registeredCapital);
        //console.log('registeredCapital' , registeredCapital);
        _this.props.setValueByReducers('corporation.registeredCapital', registeredCapital);
    }

    onChangeCallback(_this, value) {
        const key = _this.props.valueLink.split('.')[1];
        const valueLink = 'saveCorporationWarn.' + key;
        if(valueLink == 'saveCorporationWarn.corporationName' && value && value.length > 0){
            this.props.loadCorporationByCorporationName(value, this, this.onBlurCallbackCallback);
        }
        if (value && value.length > 0) {
            this.props.setValueByReducers(valueLink, '');
        } else {
            this.props.setValueByReducers(valueLink, validateType.saveCorporationWarn[key]);
        }
    }

    chooseSelectWarn(value, key, type, _this) {
        const _key = _this.props.valueLink.split('.')[1];
        const valueLink = 'saveCorporationWarn.' + _key;
        if(key){
            this.props.setValueByReducers(valueLink, '');
        }
    }

    getTimeCallback(_this, time){
        const key = _this.props.valueLink.split('.')[1];
        const valueLink = 'saveCorporationWarn.' + key;
        if (time && time.length > 0) {
            this.props.setValueByReducers(valueLink, '');
        } else {
            this.props.setValueByReducers(valueLink, validateType.saveCorporationWarn[key]);
        }
    }

    render() {
        const star = <span className="redFont">*</span>;
        const provinceList = this.props.getValueByReducers('provinceList').toJS();
        const cityList = this.props.getValueByReducers('cityList').toJS();
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const corporation = this.props.getValueByReducers('corporation').toJS();
        const saveCorporationWarn = this.props.getValueByReducers('saveCorporationWarn').toJS();
        //console.log(provinceList, cityList);
        return (
            <div className="corporationInfo">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业名称:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus {...this.props}
                            onBlurCallback={::this.onBlurCallback}
                            onChangeCallback={::this.onChangeCallback}
                            validRules={{maxLength:100}}
                            valueLink='corporation.corporationName' placeholder='请填写营业执照上的企业名称'/>
                    </Col>
                </Row>
                <LabelWarn title={this.state.corporationNameWarn}/>
                <LabelWarn title={saveCorporationWarn.corporationName}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onChangeCallback={::this.onChangeCallback}
                                   validRules={{maxLength:100}}
                                   valueLink='corporation.corporationAddress' placeholder='请填写公司注册地址'/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.corporationAddress}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}意向合作省份:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus list={provinceList}
                                    config={this.props.config}
                                    param={{id:'provinceId', name:'provinceName'}}
                                    valueLink='corporation.provinceId'
                                    getValueCallback={::this.chooseProvince}
                                    placeholder="请选择省份"/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.provinceId}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}意向合作城市:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus ref='selectPlusCity'
                                    list={cityList}
                                    config={this.props.config}
                                    valueLink='corporation.cityId'
                                    getValueCallback={::this.chooseSelectWarn}
                                    param={{id:'cityId', name:'cityName'}}
                                    placeholder="请选择城市"/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.cityId}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}企业性质:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus list={defaultDara.corporationTypeEum}
                                    config={this.props.config}
                                    defaultId={this.state.defaultSelectedCorporationTypeId}
                                    getValueCallback={::this.chooseSelectWarn}
                                    valueLink='corporation.corporationType'
                                    placeholder="请选择企业性质"/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.corporationType}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}成立时间:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <CalendarPanelPlus startDate="1900-01-01"
                                           valueLink='corporation.foundingTime'
                                           getValueCallback={::this.getTimeCallback}
                                           defaultDate={this.state.corporationInfoDate}
                                           config={this.props.config} placeholder="请选择公司成立时间"/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.foundingTime}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}注册资金:</span>
                    </Col>
                    <Col sm={8} className="capital-col" end>
                        <InputPlus config={this.props.config} {...this.props}
                                   validRules={{maxLength:10,isInt:true}}
                                   onBlurCallback={this.onRegisteredCapitalBlurCallback}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='corporation.registeredCapital'/>
                        <span className="capital-span-right">元</span>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.registeredCapital}/>
                <TitleRight title="公司规模"/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}财务状况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <SelectPlus list={defaultDara.financialSituationEum}
                                    config={this.props.config}
                                    valueLink='corporation.financialSituation'
                                    getValueCallback={::this.chooseSelectWarn}
                                    placeholder="请选财务状况"/>
                    </Col>
                </Row>
                <LabelWarn title={saveCorporationWarn.financialSituation}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}是否有团队:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioOrig style={{padding: '10px'}}
                                   config={this.props.config}
                                   list={defaultDara.hasTeamEum}
                                   name="hasTeamEum"
                                   defaultId="true"
                                   valueLink='corporation.hasTeam'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasTeam?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}团队人数:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   validRules={{isInt:true,maxLength:8}}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='corporation.teamPeople' placeholder='请填写团队人数'/>
                    </Col>
                </Row>
                <LabelWarn style={{display:corporation.hasTeam?'block':'none'}}
                           title={saveCorporationWarn.teamPeople}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室情况:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioOrig style={{padding: '10px'}}
                                   config={this.props.config}
                                   list={defaultDara.hasOfficeEum}
                                   name="hasOfficeEum"
                                   defaultId="true"
                                   valueLink='corporation.hasOffice'/>
                    </Col>
                </Row>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室地址:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='corporation.officeAddress' placeholder='请填写办公室地址'/>
                    </Col>
                </Row>
                <LabelWarn style={{display:corporation.hasOffice?'block':'none'}}
                           title={saveCorporationWarn.officeAddress}/>
                <Row style={{display:corporation.hasOffice?'block':'none'}}>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}办公室面积:</span>
                    </Col>
                    <Col sm={8} className="capital-col" end>
                        <InputPlus config={this.props.config}
                                   validRules={{maxLength:5,isInt:true}}
                                   onChangeCallback={::this.onChangeCallback}
                                   valueLink='corporation.officeSize' placeholder='请填写办公室面积'/>
                        <span className="capital-span-right">平方米</span>
                    </Col>
                </Row>
                <LabelWarn style={{display:corporation.hasOffice?'block':'none'}}
                           title={saveCorporationWarn.officeSize}/>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">其他信息:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <TextArea rows={4} {...this.props}
                                  valueLink='corporation.remark'
                                  placeholder="如有其他信息，请填写，例如公司网址，公司背景，公司优势等"/>
                    </Col>
                </Row>
            </div>);
    }
}