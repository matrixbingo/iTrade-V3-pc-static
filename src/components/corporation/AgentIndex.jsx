import React, { Component ,PropTypes} from 'react';
import {Dialog,Grid,Row,Col,Button} from 'eagle-ui';
import Styles from './AgentIndex.less';
import {transfor} from '../../utils/utils.es6';
import AgentMain from './agentManage/AgentMain.jsx';

export default class AgentIndex extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    render() {
        return (
            <div>
                <AgentMain {...this.props} />
            </div>);
    }
}