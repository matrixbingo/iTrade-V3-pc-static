import React, { Component ,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Row,Col} from 'eagle-ui';
;
import Styles from './LabelWarn.less';

export default class LabelWarn extends Component {

    static defaultProps = {
        title: '',
        style: {}
    }

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div style={this.props.style}>
                <Row style={{display:this.props.title.length > 0?'block':'none'}}>
                    <Col sm={4} className="base-col">
                    </Col>
                    <Col sm={8} className="end-col labelWarn" end style={{paddingLeft: '14px'}}>
                        {this.props.title}
                    </Col>
                </Row>
            </div>
        );
    }
}