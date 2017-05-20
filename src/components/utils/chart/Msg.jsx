/**
 * Created by liang.wang on 16/9/29.
 */
import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import ReactHighcharts from 'react-highcharts';
import {actionType} from '../../../constants/action-type.es6';
import {DataUtil, FormUtil} from '../../../utils/utils.es6';
import Styles from './Msg.less';
import {fetch} from 'eg-tools';

export default class Msg extends Component {
    static defaultProps = {
        ele: {},
        value: '123'
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: [],
            series: [
                {
                    name: '买入',
                    data: []
                },
                {
                    name: '卖出',
                    data: []
                }
            ]
        };
    }

    loadData(){
        const _this = this;
        const type = this.props.ele.type;
        const code = this.props.ele.code;
        const time = this.props.ele.time;
        if(type && code && time){
            const url = actionType.BASE_URL + '/trade/stock/buysel';
            fetch(url + "?time=" + time + '&code=' +code + '&type=' +type, {}, function (data) {
               if(data && data.code == 200){
                    _this.initData(data.msg.list);
               }
            }, '', {isLoadingBar: false});
        }
    }

    initData(list){
        let categories = [];
        let series = [
            {
                name: '买入',
                data: []
            },
            {
                name: '卖出',
                data: []
            }
        ];
        if(list.length > 0){
            for(let i in list){
                const item = list[i];
                categories.push(DataUtil.formatTime(item.time));
                series[0].data.push(item.buy);
                series[1].data.push(item.sel);
            }
        }
        this.setState({
            categories:categories,
            series:series,
            title:list[0].name + '(' + DataUtil.getType(this.props.ele.type) + ')'
        });
    }

    render() {
        const config = {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                pointWidth: 30
            },
            chart: {
                type: 'column'
            },
            title: {
                text: this.state.title
            },
            xAxis: {
                categories: this.state.categories
            },
            credits: {
                enabled: false
            },
            series: this.state.series
        };
        const url = FormUtil.getStockUrl(this.props.ele.code);
        return (
            <div className="msg">
                <a href={url} onMouseOver={::this.loadData} target="_blank">{this.props.value}</a>
                <div className="msg-body">
                    <ReactHighcharts config={config} style={{'min-width': "1200px"}}></ReactHighcharts>
                </div>
            </div>
        )
    }
}
