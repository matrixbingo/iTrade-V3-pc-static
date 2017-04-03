/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {RadioGroup, Input} from 'eagle-ui';
import {findDOMNode} from 'react-dom';
import {bindingMixin} from 'eg-tools';
import Immutable from 'immutable';
import Styles from './RadioOrig.less';
import {getValueBylinkedState, DataUtil, getItemByTypeId} from '../../../utils/utils.es6';
import _ from "underscore";
import $ from "jquery";

@bindingMixin
export default
class RadioOrig extends Component {
    static defaultProps = {
        param: {id: 'id', name: 'name'},
        name:'name',
        valueLink: '',
        defaultId: null,
        defaultName: null,
        getValueCallback: function () {
        }
    }

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.initData();
        this.state = {
            defaultId: this.defaultId,
            disabled: this.props.disabled,
            viewOnly: this.props.viewOnly
        };
    }

    componentWillReceiveProps(props) {
        this.initData();
        if (props.disabled && this.disabled != this.state.disabled) {
            this.setState({
                disabled: props.disabled
            })
        }
        if (props.viewOnly && props.viewOnly != this.state.viewOnly) {
            this.setState({
                viewOnly: props.viewOnly
            })
        }
    }

    initData() {
        let {list, param} = this.props, objs = {};
        try {
            if ((this.props.defaultId != null && this.props.defaultId != '') || DataUtil.validate.boolean(this.props.defaultId)) {
                this.defaultId = this.props.defaultId + '';
            } else {

                this.defaultId = this.getValueByReducers(this.props.valueLink) + '';
            }
            if (DataUtil.is.Array(list)) {
                for (let i in list) {
                    const item = list[i];
                    const id = item[param.id] + '';
                    objs[id] = item[param.name];
                }
            }
            if (DataUtil.is.Object(list)) {
                _.each(list, function (name, id) {
                    objs[id + ''] = name;
                })
            }
            this.list = objs;
        } catch (e) {
            console.error('SelectPlus.initList', e, list);
        }
    }

    setValueByReducers(key, value) {
        if (key && value) {
            if (value == 'true') {
                value = true;
            }
            if (value == 'false') {
                value = false;
            }
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

    getValueCallback(e) {
        this.setState({
            defaultId: e
        });
        if (this.props.valueLink) {
            this.setValueByReducers(this.props.valueLink, e);
        }
        this.props.getValueCallback && this.props.getValueCallback(e);
        console.log('e', this.transfor(e));
    }

    transfor(v) {
        let b = v + '';
        if (b && b.toLowerCase() == 'false') {
            return false;
        }
        if (b && b.toLowerCase() == 'true') {
            return true;
        }
        return v;
    }

    createRadios(){
        const _this = this;
        let radios = [];
        for(let key in this.list){
            let checked = false;
            if(this.state.defaultId == key || this.state.defaultName == this.list[key]){
                checked = true;
            }
            radios.push(
                <label key={key} className="label"><input name={this.props.name} type="radio" value={key} onClick={this.getValueCallback.bind(_this, key)} checked={checked}/>{this.list[key]}</label>
            );
        }
        return radios;
    }

    render() {
        return (
            <div className="radioOrig">
                {this.createRadios()}
            </div>
        );
    }
}