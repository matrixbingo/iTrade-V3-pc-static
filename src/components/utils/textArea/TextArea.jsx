/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {getValueBylinkedState} from '../../../utils/utils.es6';
import Styles from './TextArea.less';

export default class TextArea extends Component {
    static defaultProps = {
        disabled: false,
        viewOnly: false,
        rows: 10,
        placeholder: '',
        valueLink: '',
        defaultValue:''
    }

    constructor(props) {
        super(props);
        this.state = {
            disabled: this.props.disabled,
            viewOnly: this.props.viewOnly
        };
    }

    change(e) {
        this.props.setValueByReducers(this.props.valueLink, e.target.value);
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

    getValue(){
        if(this.props.defaultValue){
            return this.props.defaultValue;
        }
        let {config} = this.props;
        return getValueBylinkedState(config, this.props.valueLink);

    }

    render() {
        const height = this.props.rows * 14;
        const value = this.getValue();
        if (this.state.viewOnly) {
            return (
                <div className="textArea">
                    <span style={{height:height+'px'}}>{value}</span>
                </div>
            )
        }
        return (
            <textarea disabled={this.props.disabled}
                      ref="description"
                      onChange={this.change.bind(this)}
                      rows={this.props.rows}
                      value={value}
                      placeholder={this.props.placeholder}></textarea>
        );
    }
}
