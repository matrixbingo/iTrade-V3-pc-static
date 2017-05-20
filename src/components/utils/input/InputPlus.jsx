/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {Input} from 'eagle-ui';
import {findDOMNode} from 'react-dom';
import {bindingMixin} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState, trim, getFloat, getLength, getInt} from '../../../utils/utils.es6';
import Styles from './InputPlus.less';

@bindingMixin
export default
class InputPlus extends Component {
    static defaultProps = {
        disabled: false,
        viewOnly: false,
        span:false,
        className: 'f14 font',
        valueLink: '',
        placeholder: '',
        defaultValue: '',
        validRules: {
            isInt: false,
            isFloat: false,
            maxLength: null
        },
        style: {},
        onChangeCallback: function () {
        },
        onBlurCallback: function () {
        }
    }

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {
            defaultValue:this.props.defaultValue,
            disabled: this.props.disabled,
            viewOnly: this.props.viewOnly
        };
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
            console.error('getValueByReducers error', key, value);
        }
    }

    componentWillReceiveProps(props) {
        let flag = false;
        if (props.disabled != this.state.disabled) {
            flag = true;
        }
        if (props.viewOnly != this.state.viewOnly) {
            flag = true;
        }
        if (props.defaultValue != this.state.defaultValue) {
            flag = true;
        }
        if(flag){
            this.setState({
                defaultValue: props.defaultValue,
                disabled: props.disabled,
                viewOnly: props.viewOnly
            })
        }
    }

    change(e) {
        let val = trim(e.target.value);
        val = this.validData(val);
        this.setValueByReducers(this.props.valueLink, val);
        this.props.onChangeCallback && this.props.onChangeCallback(this, val);
        //console.log('change', val);
    }

    onblur(e) {
        let val = trim(e.target.value);
        val = this.defaultValue(val);
        this.setValueByReducers(this.props.valueLink, val);
        this.props.onBlurCallback && this.props.onBlurCallback(this, val);
    }

    validData(val) {
        if (this.props.validRules.maxLength) {
            val = getLength(val, this.props.validRules.maxLength);
        }
        if (this.props.validRules.isInt) {
            val = getInt(val);
        }
        if (this.props.validRules.isFloat) {
            val = getFloat(val);
        }
        return val;
    }

    defaultValue(val) {
        if (this.props.defaultValue && val == '') {
            val = this.props.defaultValue;
        }
        return val;
    }

    setDisabled(ref, is) {
        this.input = ref;
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.disabled = is;
        }
    }

    getDefaultValue(){
        if(this.state.defaultValue){
            return this.state.defaultValue;
        }
        let val = this.getValueByReducers(this.props.valueLink);
        if(this.state.disabled || this.state.viewOnly){
            if(val){
                return val;
            }
        }else{
            return val;
        }
        return this.props.placeholder;
    }

    render() {
        const _this = this;
        let val = this.getDefaultValue();
        if (this.state.viewOnly) {
            if(this.props.span){
                return (
                    <div className="inputPlus">
                        <span>{val}</span>
                    </div>
                );
            }
            return (
                <div className="inputPlus">
                    <Input type="text" value={val}
                           ref={(ref)=>{_this.setDisabled(ref, true)}}/>
                </div>
            );
        }
        if (this.state.disabled) {
            return (
                <Input disabled={true} style={this.props.style} className={this.props.className} type="text" value=''
                       placeholder={val}
                       ref={(ref)=>{_this.setDisabled(ref, true)}}/>
            );
        } else {
            return (
                <Input style={this.props.style}
                       className={this.props.className} type="text" value={val}
                       ref={(ref)=>{_this.setDisabled(ref, false)}}
                       placeholder={this.props.placeholder}
                       onChange={::this.change}
                       onBlur={::this.onblur}/>
            );
        }
    }
}
