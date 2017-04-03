/**
 * Created by liang.wang on 16/9/29.
 */
import React, {Component, PropTypes} from 'react';
import {Row,Col} from 'eagle-ui';
import classNames from 'classnames';
import {findDOMNode} from 'react-dom';
import {fetch} from 'eg-tools';
import Drawing from './Drawing.jsx';//js图形界面
import {DataUtil} from '../../../utils/utils.es6';
import $ from "jquery";

export default class DropDownSuggestion extends Component {

    static defaultProps = {
        format: {leng: 50, title: {'name': ' - ', 'ad': ' - ', 'organizationName': ''}},
        placeholder: "请填写姓名",
        valueLink: '',
        initData: null, //Immutable 格式
        cancelCallback: function () {
        }
    }

    constructor(props, context) {
        super(props, context);
        this.show = 0;
        this.state = {
            formGroup: [],                  //满足联想要求的下拉框
            targetContact: {},              //选中的目标联系人
            customerClassName: '',
            placeHolder: '',
            title: '',                      //展示的数据
            pressToIndex: -1,               //初始化键盘按钮
            status: true,                   //点击enter隐藏,
            initData: this.props.initData
        };
        this.formData = this.state.targetContact;
        this.hiddenShowTimer();
        this.inintInputDefault(this.state.initData);
    }

    inintInputDefault(initData) {
        if (!initData && !this.props.valueLink) {
            console.error('DropDownSuggestion 未设置 valueLink 或 initData');
        }
        let targetContact;
        if (initData) {
            targetContact = initData;
            this.props.setValueByReducers(this.props.valueLink, initData);
        }

        if (!initData && this.props.valueLink) {
            targetContact = this.props.getValueByReducers(this.props.valueLink);
        }
        //console.log('targetContact', targetContact);

        const _this = this;
        setTimeout(function () {
            if (targetContact && DataUtil.is.Object(targetContact)) {
                _this.clickHandler(targetContact);
            } else {
                _this.cancelInput();
            }
        }, 500);
    }

    /**
     * 全屏点击隐藏提示
     */
    hiddenShowTimer() {
        const _this = this;
        if (this.show == 0) {
            $("#root").on("click", function (e) {
                if (e.target.parentNode.className != "select-drop-down-input") {
                    _this.setState({
                        status: true
                    });
                }
            });
            this.show = 1;
        }
    }

    componentWillReceiveProps(props) {
        if (!DataUtil.isEqual(props.initData, this.state.initData)) {
            this.setState({
                initData: props.initData
            });
            this.inintInputDefault(props.initData);
            //console.log('componentWillReceiveProps : -------------->', props.initData);
        }
    }

    componentDidMount() {
        var that = this;
        findDOMNode(this.refs['suggestContainer']).addEventListener('mouseover', ()=> {
            that.judgeStatus();
        });
        this.node = findDOMNode(this.refs['drop-suggestion-input']);
        //控制回调函数执行队列
        this.node.eventArray = [];
        this.node.addEventListener('input', (e)=> {
            /**
             * 始终保持最后一次输入的回调进行渲染都能够进行网络请求
             */
            that.node.eventArray.push(e.target.value);
            that.handleChange(e.target.value);
        });
        this.node.addEventListener('focus', ()=> {
            that.setState({
                status: false
            })
        });
        this.setState({
            customerClassName: this.props.customerClassName || "drop-down-suggestion",
            placeHolder: this.props.placeholder
        });
    }

    handleChange(value) {
        var that = this;
        let {url}=this.props;
        that.setState({
            title: value,
            status: false
        });
        fetch(url + "?keyword=" + encodeURI(value), {}, function (data) {
            /**
             * 保证最后输入的结果肯定会被执行，同时优化react渲染时机
             * @type {T}
             */
            let lastValue = [].slice.call(that.node.eventArray).pop();
            if (lastValue == value) {
                that.setState({
                    formGroup: data.msg || data || [],
                    targetContact: {}
                });
            }
        }, '', {isLoadingBar: false});
    }

    /**
     * 隐藏提示
     */
    judgeStatus() {
        this.setState({
            status: false
        });
        if (Object.keys(this.state.targetContact).length < 1) {
            //alert('请选择列表中的联系人数据');
        }
        this.node.eventList = [];
        this.formData = this.state.targetContact;
    }

    /**
     * 处理点击操作
     * @param ele
     */
    clickHandler(ele) {
        let title = this.renderTitleFunc(ele);
        if(title == ''){
            this.cancelInput();
            return;
        }
        this.setState({
            targetContact: ele,
            status: true,
            title: title
        });
        this.formData = ele;
        this.props.setValueByReducers(this.props.valueLink, ele);
    }

    renderTitleFunc(ele) {
        const leng = this.props.format.leng;
        const title = this.props.format.title;
        let arr = [], item, next, finalOutPut = '';
        for (let key in title) {
            item = {
                name: ele[key] || '',
                link: title[key]
            }
            arr.push(item);
        }
        let no = 0;
        for (let i in arr) {
            item = arr[i];
            item.name = item.name + '';
            if (no < arr.length - 1) {
                next = arr[no + 1];
                next.name = next.name + '';
                finalOutPut += item.name + (next.name.length > 0 ? item.link : '');
            } else {
                finalOutPut += item.name.length > 0 ? (item.name + item.link) : '';
            }
            no++;
        }
        //console.log('finalOutPut : ' + finalOutPut);
        if (finalOutPut.length > leng) {
            return finalOutPut.replace(/\s/g, '').substring(0, leng) + '...'
        } else {
            return finalOutPut
        }
    }

    renderKeyPress(activeIndex) {
        //console.log('renderKeyPress : ' + activeIndex);
        let {formGroup}=this.state;//列表总长度
        function lengthHandle(ele) {
            if (ele < 0) {
                return -1
            } else if (ele >= formGroup.length) {
                //回归头部
                return 0
            } else {
                return ele
            }
        }

        let renderIndex = lengthHandle(activeIndex);
        if (formGroup && formGroup[renderIndex]) {
            this.setState({
                pressToIndex: renderIndex,
                targetContact: formGroup[renderIndex],
                title: this.renderTitleFunc(formGroup[renderIndex])
            });
            this.props.setValueByReducers(this.props.valueLink, formGroup[renderIndex]);
        } else {
            this.setState({
                pressToIndex: renderIndex,
                targetContact: {},
                title: ''
            });
            this.props.setValueByReducers(this.props.valueLink, {});
        }
        this.formData = this.state.targetContact;
    }

    keyHandler(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case 27: //esc
                break;
                return;
            case 38: //up键
                this.renderKeyPress(--this.state.pressToIndex);
                return;
            case 40: //down键
                this.renderKeyPress(++this.state.pressToIndex);
                return;
            case 13: //enter
                event.preventDefault();
                event.stopPropagation();
                this.renderKeyPress(this.state.pressToIndex);
                this.setState({
                    status: true
                });
                return;
            default:
                break;
        }
    }

    cancelInput() {
        const targetContact = this.state.targetContact;
        //console.log("targetContact : ", targetContact);
        this.props.cancelCallback && this.props.cancelCallback(targetContact);
        this.setState({
            pressToIndex: -1,
            targetContact: {},
            title: ''
        });
        this.formData = {};
        this.node.value = '';
        this.props.setValueByReducers(this.props.valueLink, {});
    }

    getSelected() {
        return this.state.targetContact;
    }

    renderChildMenu(formGroup) {
        let {pressToIndex,status}=this.state;
        let _this = this;
        if (!formGroup.map) {
            return null;
        }
        let XML = formGroup && formGroup.length > 0 ?
            <div id='question-multi-menu-body' className="question-multi-menu-body">
                <ul className="select-drop-down-list">
                    {
                        formGroup && formGroup.map((ele, index)=> {
                            let value = _this.renderTitleFunc(ele); //ele.name+" "+(ele.employeeNumber?ele.employeeNumber:"")
                            return <li key={index}
                                       className={pressToIndex==index?"select-drop-down-input on":'select-drop-down-input'}
                                       onClick={()=>{_this.clickHandler(ele)}}>
                                <div>{value}</div>
                            </li>
                        })
                    }
                </ul>
            </div> : <div></div>;
        if (status) {
            XML = null;
        }
        return XML;
    }

    render() {
        let {formGroup,title,targetContact}=this.state;
        //仅当点击数据的时候才进行样式重新渲染
        let initWidth = 270;
        let calWidth = initWidth > 300 ? 300 : initWidth;
        let inputWidth = Object.keys(targetContact).length > 0 ? (calWidth - 40) + 'px' : calWidth > 140 ? (calWidth - 40) + 'px' : '100px';
        let hasDataStyle = Object.keys(targetContact).length > 0 ? {
            width: calWidth + 'px',
            background: 'rgba(203, 227, 247, 0.06)',
            color: '#000',
            padding: '3px 3px 3px 5px'
        } : {
            padding: '3px 3px 3px 5px',
            border: '1px solid transparent'
        };
        var that = this;
        //手动展示
        if (this.node && Object.keys(targetContact).length > 0) {

            this.node.value = this.renderTitleFunc(targetContact);
        }
        return (
            <div className={this.state.customerClassName} ref='suggestContainer' onKeyDown={this.keyHandler.bind(this)}>
                <div style={{width:'inherit',padding:'6px 9px'}} className="drop-down-suggestion-head">
                    <div style={hasDataStyle}
                         className={Object.keys(targetContact).length>0?"drop-down-container-input":''}>
                        <input
                            ref='drop-suggestion-input'
                            style={{outline:'none',
                                    display:'inline-block',
                                    width:inputWidth,
                                    border:'none',
                                    background: 'none',
                                    verticalAlign:'middle'}}
                            placeholder={this.state.placeHolder}/>
                        <Drawing onClick={()=>{that.cancelInput()}} show={!!this.state.title}/>
                    </div>
                </div>
                {this.renderChildMenu(formGroup)}
            </div>
        );
    }
}