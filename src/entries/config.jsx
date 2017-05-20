/**
 * APP主程序入口
 */
import React, { Component ,PropTypes} from 'react';
import {render} from "react-dom";
import {BindReact} from 'eg-tools';
import TradeContainer from '../containers/TradeContainer.jsx';
import * as reducers from '../reducers/index.es6';

//判断执行dev环境

render(
    <BindReact Module={TradeContainer} reducers={reducers}/>,
    document.getElementById('root')
);