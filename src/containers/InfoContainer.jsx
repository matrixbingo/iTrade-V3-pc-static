import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col} from 'eagle-ui';
import {bindingMixin,Toast} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState} from '../utils/utils.es6';
import * as actions from '../actions/index.es6';
import InfoPanl from '../components/register/into/InfoPanl.jsx';
import Styles from '../less/Common.less';
import {DataUtil,FormUtil} from '../utils/utils.es6';

@connect(state => ({
    config: state.config,
    fetching: state.fetching,
    dialogConfig: state.dialogConfig
}), actions)
@bindingMixin
export default
class InfoContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {};
        FormUtil.setRootClass();
        window.onresize = function () {
            FormUtil.setRootClass();
        }
        this.props.loadAllProvincesCities();
    }

    setValueByReducers(key, value) {
        if (key && key) {
            this.manualChange(key, Immutable.fromJS(value));
        } else {
            console.log('setValueByReducers error', key, value);
        }
    }

    getValueByReducers(key) {
        if (key) {
            const {config} = this.props;
            return getValueBylinkedState(config, key);
        } else {
            console.log('getValueByReducers error', key, value);
        }
    }

    render() {
        return (
            <div>
                <InfoPanl {...this.props}
                    setValueByReducers={::this.setValueByReducers}
                    getValueByReducers={::this.getValueByReducers}/>
            </div>
        );
    }
}