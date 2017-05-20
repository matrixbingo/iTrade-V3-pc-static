/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {RadioGroup, Input} from 'eagle-ui';
import {findDOMNode} from 'react-dom';
import {bindingMixin} from 'eg-tools';
import Immutable from 'immutable';
import Styles from './RadioPlus.less';
import {getValueBylinkedState, DataUtil, getItemByTypeId} from '../../../utils/utils.es6';
import _ from "underscore";

@bindingMixin
export default
class RadioPlus extends Component {
    static defaultProps = {
        disabled: false,
        viewOnly: false,
        param: {id: 'id', name: 'name'},
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
            }else{

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
        if (this.state.disabled) {
            this.setState({
                defaultId: this.defaultId
            });
            return;
        }
        this.setState({
            defaultId: e
        });
        if (this.props.valueLink) {
            this.setValueByReducers(this.props.valueLink, e);
        }
        this.props.getValueCallback && this.props.getValueCallback(e);
        console.log('e', this.transfor(e));
    }

    transfor(v){
        let b = v +'';
        if(b && b.toLowerCase() == 'false'){
            return false;
        }
        if(b && b.toLowerCase() == 'true'){
            return true;
        }
        return v;
    }

    getRadios() {
        const list = this.list;
        let radios = [];
        if (DataUtil.is.Object(list)) {
            _.each(list, function (name, id) {
                radios.push(<Input type="radio" label={name} value={id}/>);
            })
        }
        return radios;
    }

    setDisabled(ref, is) {
        this.input = ref;
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.disabled = is;
        }
    }

    getViewOnlyValue() {
        if (this.defaultId) {
            return this.list[this.defaultId];
        }
        return this.props.defaultName
    }

    render() {
        const _this = this;
        let style = {};
        style = _.extend(style, this.props.style);
        if (this.state.viewOnly) {
            const val = this.getViewOnlyValue();
            return (
                <div className="inputPlus">
                    <Input type="text" value={val}
                           ref={(ref)=>{_this.setDisabled(ref, true)}}/>
                </div>
            );
        }

        if (this.state.disabled) {
            return <RadioGroup className="radioPlus" style={style} defaultChecked={this.state.defaultId}
                               getValueCallback={(e)=>{_this.getValueCallback(e);}}>
                {this.getRadios()}
            </RadioGroup>
        } else {
            return <RadioGroup style={this.props.style} defaultChecked={this.state.defaultId}
                               getValueCallback={(e)=>{_this.getValueCallback(e);}}>
                {this.getRadios()}
            </RadioGroup>
        }
    }
}