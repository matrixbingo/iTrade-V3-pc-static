import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Dialog,Grid,Row,Col} from 'eagle-ui';
import {bindingMixin,Toast} from 'eg-tools';
import Immutable from 'immutable';
import {getValueBylinkedState} from '../utils/utils.es6';
import * as actions from '../actions/index.es6';
import Head from '../components/register/head/Head.jsx';
import RegisterMain from '../components/register/main/RegisterMain.jsx';
import Styles from '../less/Common.less';
import {DataUtil,FormUtil,HipoUtil} from '../utils/utils.es6';
import $ from "jquery";

@connect(state => ({
    config: state.config,
    fetching: state.fetching,
    dialogConfig: state.dialogConfig
}), actions)
@bindingMixin
export default
class RegisterContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.setBinding('config');
        this.state = {
            msgMain: '',
            msgCont: '',
            displayTest: 'none',
            showMsgDialog: false
        };
        FormUtil.setRootClass();
        window.onresize = function () {
            FormUtil.setRootClass();
        }
        this.props.loadAllProvincesCities();
        HipoUtil.pv();
        FormUtil.share();
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

    renderLoadingToast() {
        let toast = null;
        /*if (this.props.fetching == 1) {
         toast = <Toast>加载中...</Toast>;
         }*/
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

    validate(data) {
        const _this = this;
        let flag = true, item, v;
        for (let i in data) {
            item = data[i]
            if (item.l) {
                item['v'] = this.getValueByReducers(item.l);
            }
            for (let i in item.m) {
                v = item.m[i];
                if (!DataUtil.validate[i](item.v)) {
                    if (!item.s) {
                        this.showMsgError(v);
                    } else {
                        alert(v);
                    }
                    flag = false;
                    break;
                }
                if (item.callback) {
                    flag = item.callback(_this, item);
                }
            }
            if (!flag) {
                break;
            }
        }
        return flag;
    }

    validateWarn(data, warnLink) {
        const _this = this;
        let warns = this.getValueByReducers(warnLink).toJS();
        let flag = true, item, v;
        for (let k in data) {
            item = data[k];
            if (item.l) {
                item['v'] = this.getValueByReducers(item.l);
            }
            for (let i in item.m) {
                v = item.m[i];
                if (!DataUtil.validate[i](item.v)) {
                    warns[k] = item.m[i];
                    if (flag) {
                        flag = false;
                    }
                }

                if (item.callback) {
                    const _flag = item.callback(_this, item, warns, DataUtil);
                    if (flag && !_flag) {
                        flag = _flag;
                    }
                }
            }
        }
        if (!flag) {
            this.setValueByReducers(warnLink, warns);
        }
        return flag;
    }

    showMsgDialogCallBack() {
        if (this.state.isReload) {
            window.location.reload();
        } else {
            Dialog.close();
        }
    }

    showMsgDialog() {
        const width = FormUtil.getDialogWidth();
        let height = '120px';
        if (this.state.msgCont && this.state.msgCont.length > 0) {
            height = '150px';
        }
        return <Dialog id="showMsgDialogModal" egSize="sm" title="" style={{width: width + 'px'}} buttons={[
                    {
                        egStyle:'info',
                        name:'我知道了',
                        callback:()=>{this.showMsgDialogCallBack()}
                    }
                    ]}>
            <Grid
                style={{overflow:'hidden',height:{height}, textAlign: 'center', paddingTop: '35px'}}>
                <Row>
                    <Col sm={12}>
                        <span style={{fontWeight: 'bolder', fontSize: '20px'}}>{this.state.msgMain}</span>
                    </Col>
                </Row>
                <Col sm={12}></Col>
                <Row>
                    <Col sm={12}>
                        <span style={{fontSize: '14px',color:'#848282'}}>{this.state.msgCont}</span>
                    </Col>
                </Row>
            </Grid>
        </Dialog>;
    }

    dialogMask(id) {
        //alert(document.getElementsByClassName('eg-dialog-mask')[0].className)
        Dialog.mask(id).then(function () {
            Dialog.close();
        }, function (type) {
        });
    }

    alertMsg(msgMain, msgCont, isReload) {
        this.setState({
            msgMain: msgMain,
            msgCont: msgCont,
            isReload: isReload
        });
        const userAgent = navigator.userAgent.toLocaleLowerCase();
        if (userAgent.indexOf('iphone') > 0 && userAgent.indexOf('dianping') > 0) {
            msgCont = msgCont.length > 0 ? ',' + msgCont : ''
            this.showMsgError(msgMain + msgCont);
        } else {
            this.dialogMask('showMsgDialogModal');
        }
    }

    render() {
        let dialogCfg = this.props.config.toJS().dialogConfig;
        return (
            <div>
                {this.showMsgDialog()}
                {this.renderLoadingToast()}
                {dialogCfg.show ? <Toast className={'toast-'+ dialogCfg.type}><i></i>{dialogCfg.content}</Toast> : null}
                <Head {...this.props}
                    setValueByReducers={::this.setValueByReducers}
                    getValueByReducers={::this.getValueByReducers}
                    showMsgError={::this.showMsgError}
                    showMsgSucc={::this.showMsgSucc}
                    alertMsg={::this.alertMsg}/>
                <RegisterMain {...this.props}
                    validateWarn={::this.validateWarn}
                    setValueByReducers={::this.setValueByReducers}
                    getValueByReducers={::this.getValueByReducers}
                    showMsgError={::this.showMsgError}
                    showMsgSucc={::this.showMsgSucc}
                    validate={::this.validate}
                    alertMsg={::this.alertMsg}/>

            </div>);
    }
}