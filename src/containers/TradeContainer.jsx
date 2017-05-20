import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid,Row,Col,Panel,Dialog,Tabset,Tab} from 'eagle-ui';
import {bindingMixin,Toast} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState} from '../utils/utils.es6';
import * as actions from '../actions/index.es6';
import TradeList from '../components/trade/TradeList.jsx';
import Styles from '../less/Common.less';
import '../less/ConfigContainer.less';
import {DataUtil} from '../utils/utils.es6';

@connect(state => ({
    config: state.config,
    fetching: state.fetching,
    dialogConfig: state.dialogConfig
}), actions)
@bindingMixin
export default class TradeContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {};

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
            console.error('getValueByReducers error', key);
        }
    }

    renderLoadingToast() {
        let toast = null;
        if (this.props.fetching == 1) {
            toast = <Toast>加载中...</Toast>;
        }
        if (this.props.fetching == 2) {
            toast = <Toast>提交中，请稍后...</Toast>;
        }
        return toast;
    }

    showMsgError(content) {
        this.props.setDialog({
            show: true,
            type: 'error',
            content: content,
            showTime: 2000
        });
    }

    showMsgSucc(content) {
        this.props.setDialog({
            show: true,
            type: 'success',
            content: content,
            showTime: 1000
        });
    }

    callback(index) {
        if (this.state.tabIndex !== index) {
            this.setState({
                tabIndex: index
            });
            this.setTabIndexCallback(index);
        }
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
        this.setTabIndexCallback(index);
    }
    setTabIndexCallback(index) {
        if (index == 0) {

        }
    }

    render() {
        let dialogCfg = this.props.config.toJS().dialogConfig;
            return (
                <div>
                    {this.renderLoadingToast()}
                    {dialogCfg.show ? <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                    <Panel className="marginTopSpace paddingSpace question-margin configGXIndex">
                        <Tabset disableHoverAnimation={true} activeTab={this.state.tabIndex}
                                tabCallback={::this.callback}>
                            <Tab heading='主力列表'>
                                <TradeList {...this.props}
                                    setValueByReducers={::this.setValueByReducers}
                                    getValueByReducers={::this.getValueByReducers}
                                    validate showMsgError={::this.showMsgError}
                                    showMsgSucc={::this.showMsgSucc}
                                    setTabIndex={::this.setTabIndex}/>
                            </Tab>
                        </Tabset>
                    </Panel>
                </div>
            )
    }
}