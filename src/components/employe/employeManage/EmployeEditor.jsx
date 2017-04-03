import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,RadioGroup,Select,CalendarPanel,Input} from 'eagle-ui';
import {CalendarPanelPlus, InputPlus, SelectPlus, TextArea, RadioPlus, DropDownSuggestion} from '../../utils/index.jsx';
import Styles from './EmployeEditor.less';
import {DataUtil} from '../../../utils/utils.es6';

export default class EmployeEditor extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            corporationNameWarn: ''
        };
        this.props.loadProvinceList();
        this.getUserUrl = '/apollo/agent/user/search';
    }

    chooseProvince(value, key, type) {
        let employee = this.props.getValueByReducers('employee').toJS();
        employee.provinceId = value
        employee.cityId = 0;
        this.props.setValueByReducers('employee', employee);
        if (this.refs.selectPlusCity) {
            this.refs.selectPlusCity.cleanName();
        }
        if(type != 'init'){
            this.props.loadCityListByProvinceId(value);
        }
    }

    render() {
        const star = <span className="redFont">*</span>;
        const provinceList = this.props.getValueByReducers('provinceList').toJS();
        const cityList = this.props.getValueByReducers('cityList').toJS();
        const defaultDara = this.props.getValueByReducers('defaultDara').toJS();
        const employee = this.props.getValueByReducers('employee').toJS();
        const editorType = this.props.getValueByReducers('employeEditorPage.editorType');
        const managerName = this.props.getValueByReducers('managerName').toJS();

        //console.log('EmployeEditor:', editorType, managerName);
        return (
            <div className="employeEditor">
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">该代理商公司名称:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={true}
                                   config={this.props.config}
                                   valueLink='corporation.corporationName'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}汇报对象:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <div style={{fontSize:'12px',verticalAlign:'top'}}>
                            <DropDownSuggestion url={this.getUserUrl} {...this.props}
                                                initData={managerName}
                                                valueLink='employeeEnditorPage.reportEmploye'
                                                format={{leng: 50, title: {'employeeName': ' - ', 'ad': ' - ', 'organizationName': ''}}}
                                                placeholder="请输入汇报人姓名"/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}姓名:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   validRules={{maxLength:25}}
                                   valueLink='employee.name'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}登录名:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus viewOnly={editorType == 1}
                                   config={this.props.config}
                                   validRules={{maxLength:20}}
                                   placeholder="登录名如果重复，会自动添加序号"
                                   valueLink='employee.ad'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}性别:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <RadioPlus style={{padding: '10px'}}
                                   config={this.props.config}
                                   list={defaultDara.gender}
                                   defaultId={employee.gender}
                                   valueLink='employee.gender'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col padding-top20">
                        <span className="spanInline">{star}城市:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <Col sm={6} className="end-col-select" end>
                            <SelectPlus list={provinceList}
                                        config={this.props.config}
                                        param={{id:'provinceId', name:'provinceName'}}
                                        defaultId={employee.provinceId}
                                        valueLink='employee.provinceId'
                                        getValueCallback={::this.chooseProvince}
                                        placeholder="请选择省份"/>
                        </Col>
                        <Col sm={6} className="city">
                            <SelectPlus ref='selectPlusCity'
                                        list={cityList}
                                        config={this.props.config}
                                        defaultId={employee.cityId}
                                        valueLink='employee.cityId'
                                        param={{id:'cityId', name:'cityName'}}
                                        placeholder="请选择城市"/>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}身份证号码:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   validRules={{maxLength:20}}
                                   valueLink='employee.idCard'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}邮箱:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   valueLink='employee.email'/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className="base-col">
                        <span className="spanInline">{star}手机号:</span>
                    </Col>
                    <Col sm={8} className="end-col" end>
                        <InputPlus config={this.props.config}
                                   valueLink='employee.mobile'
                                   validRules={{isInt: true,maxLength: 11}}/>
                    </Col>
                </Row>
            </div>);
    }
}