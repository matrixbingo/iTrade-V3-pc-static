/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {Select, Input} from 'eagle-ui';
import {findDOMNode} from 'react-dom';
import {bindingMixin} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState, DataUtil, getItemByTypeId} from '../../../utils/utils.es6';
import Styles from './SelectPlus.less';
import _ from "underscore";

@bindingMixin
export default
class SelectPlus extends Component {
    static defaultProps = {
        disabled: false,
        viewOnly: false,
        list: {},
        param: {id: null, name: null},
        placeholder: '',
        defaultId: null,
        defaultName: null,
        valueLink: '',
        valueLinkName: '',
        getValueCallback: function () {
        }
    }

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.initData(this.props);
        this.state = {
            defaultId: this.props.defaultId,
            list: this.list,
            disabled: this.props.disabled,
            defaultName: this.props.defaultName,
            viewOnly: this.props.viewOnly
        };
        this.state.defaultName = this.getDefaultChecked();
    }

    componentWillReceiveProps(props) {
        const list = this.initList(props);
        let flag = false;
        if (props.list && !DataUtil.isEqual(list, this.state.list)) {
            flag = true;
        }
        if (props.defaultId && props.defaultId != this.state.defaultId) {
            flag = true;
        }
        if (props.defaultName && props.defaultName != this.state.defaultName) {
            flag = true;
        }
        if (props.disabled != this.state.disabled) {
            flag = true;
        }
        if (props.viewOnly != this.state.viewOnly) {
            flag = true;
        }
        if(flag){
            let defaultName = props.defaultName;
            if(props.defaultId){
                defaultName = list[props.defaultId];
            }
            this.setState({
                defaultId: props.defaultId,
                list: list,
                disabled: props.disabled,
                defaultName: defaultName,
                viewOnly: props.viewOnly
            })
            //console.log('componentWillReceiveProps : ', this.state, defaultName);
        }
    }

    initData(props) {
        try {
            if (this.props.defaultId) {
                this.defaultId = this.props.defaultId + '';
            }
            this.list = this.initList(props);
        } catch (e) {
            console.error('SelectPlus.initData', e, props);
        }
    }

    initList(props) {
        let {list, param} = props, objs = {};
        try {
            if (list && DataUtil.is.Array(list)) {
                for (let i in list) {
                    const item = list[i];
                    const id = item[param.id] + '';
                    objs[id] = item[param.name];
                }
            }
            if (list && DataUtil.is.Object(list)) {
                _.each(list, function (name, id) {
                    objs[id + ''] = name;
                })
            }
            //console.log('initList', objs);
            return objs;
        } catch (e) {
            console.error('SelectPlus.initList', e, list);
        }
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

    getValueCallback(id, name, type) {
        this.setState({
            defaultName: name
        });
        if (this.props.valueLink) {
            this.setValueByReducers(this.props.valueLink, id);
        }
        this.props.getValueCallback && this.props.getValueCallback(id, name, type, this);
        //console.log('id, name, type', id, name, type);
    }

    cleanName() {
        this.setState({
            defaultName: ''
        });
    }

    setDisabled(ref, is) {
        this.input = ref;
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.disabled = is;
        }
    }

    setReadOnly(ref, is) {
        this.input = ref;
        if (this.input) {
            const input = findDOMNode(this.input).querySelector('input');
            input.readOnly = is;
        }
    }

    getIdbyName() {
        const list = this.list;
        const name = this.props.defaultName;
        for (let i in list) {
            if (list[i] == name) {
                return i;
            }
        }
    }

    getDefaultChecked() {
        const _this = this;
        if (this.state.defaultId) {
            if (this.props.valueLink) {
                this.setValueByReducers(this.props.valueLink, this.state.defaultId);
            }
            return this.state.list[this.state.defaultId];
        }
        if (!this.state.defaultId && this.state.defaultName) {
            if (this.props.valueLink) {
                this.setValueByReducers(this.props.valueLink, _this.getIdbyName());
            }
        }
        return this.props.defaultName;
    }

    getPlaceholder() {
        if (this.defaultId) {
            return this.state.list[this.defaultId];
        }
        if (this.props.defaultName) {
            return this.props.defaultName;
        }
        const id = this.getValueByReducers(this.props.valueLink);
        const name = this.state.list[id];
        if (name) {
            return name;
        }
        return '';
    }

    getOptions() {
        const list = this.state.list;
        let options = [];
        if (DataUtil.is.Object(list)) {
            _.each(list, function (name, id) {
                options.push(<option value={id} key={id}>{name}</option>);
            })
        }
        return options;
    }

    getViewOnlyValue() {
        if (this.state.list && this.defaultId) {
            return this.state.list[this.defaultId];
        }
        if (this.state.list && this.props.valueLink) {
            return this.state.list[this.getValueByReducers(this.props.valueLink)];
        }
        if (this.props.valueLinkName) {
            return this.getValueByReducers(this.props.valueLinkName);
        }
        return this.props.defaultName
    }

    getDefaultName() {
        return this.getDefaultName();
    }

    render() {
        const _this = this;
        if (this.state.viewOnly) {
            const val = this.getViewOnlyValue();
            return (
                <div className="selectPlus">
                    <Input type="text" value={val}
                           ref={(ref)=>{_this.setDisabled(ref, true)}}/>
                </div>
            );
        }
        if (this.state.disabled) {
            return (
                <Select ref={(ref)=>{_this.setDisabled(ref, true)}} placeholder={this.getPlaceholder()}></Select>
            );
        } else {
            return (
                <Select defaultChecked={this.state.defaultName}
                        ref={(ref)=>{_this.setReadOnly(ref, true)}}
                        getValueCallback={::this.getValueCallback} placeholder={this.props.placeholder}>
                    {this.getOptions()}
                </Select>
            );
        }
    }
}
