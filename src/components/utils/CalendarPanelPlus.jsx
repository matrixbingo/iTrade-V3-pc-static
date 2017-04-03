/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {CalendarPanel, Input} from 'eagle-ui';
import {findDOMNode} from 'react-dom';
import {bindingMixin} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState, DataUtil, getItemByTypeId} from '../../utils/utils.es6';
import _ from "underscore";

@bindingMixin
export default
class CalendarPanelPlus extends Component {
    static defaultProps = {
        disabled: false,
        viewOnly: false,
        valueLink: '',
        placeholder: '',
        defaultDate: '',
        getValueCallback: function () {
        }
    }

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {
            disabled: this.props.disabled,
            viewOnly: this.props.viewOnly,
            defaultDate: this.props.defaultDate
        };
    }

    componentWillReceiveProps(props) {
        if (props.disabled != this.state.disabled) {
            this.setState({
                disabled: props.disabled
            })
        }
        if (props.viewOnly != this.state.viewOnly) {
            this.setState({
                viewOnly: props.viewOnly
            })
        }
    }

    setValueByReducers(key, value) {
        if(key){
            this.manualChange(key, Immutable.fromJS(value));
        }else{
            console.log('setValueByReducers error', key, value);
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

    setDisabled() {
        this.input = arguments[0];
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.disabled = true;
        }
    }
    setReadOnly(ref, is) {
        this.input = ref;
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.readOnly = is;
        }
    }

    getPlaceholder() {
        if (this.props.defaultDate) {
            return this.props.defaultDate;
        }
        return this.getValueByReducers(this.props.valueLink);
    }

    setTime(time) {
        //console.log(time);
        this.setState({
            defaultDate: time
        });
        this.setValueByReducers(this.props.valueLink, time);
        this.props.getValueCallback && this.props.getValueCallback(this, time);
    }

    render() {
        const _this = this;
        if (this.state.viewOnly) {
            return (
                <div className="inputPlus">
                    <Input type="text" value={_this.getValueByReducers(this.props.valueLink)}
                           ref={(ref)=>{_this.setDisabled(ref)}}/>
                </div>
            )
        }
        if (this.state.disabled) {
            return (
                <Input disabled={true} type="text" value=''
                       placeholder={this.getPlaceholder()}
                       ref={(ref)=>{_this.setDisabled(ref)}}
                       icon="calendar"/>
            )
        } else {
            return (
                <CalendarPanel startDate={this.props.startDate} ref={(ref)=>{_this.setReadOnly(ref, true)}} getValueCallback={(ele)=>{_this.setTime(ele)}}
                               defaultDate={this.state.defaultDate}>
                    <Input placeholder={this.props.placeholder} icon="calendar"/>
                </CalendarPanel>
            )
        }
    }
}
