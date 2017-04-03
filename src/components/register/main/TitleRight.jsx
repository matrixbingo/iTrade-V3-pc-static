import React, { Component ,PropTypes} from 'react';
import {Row,Col} from 'eagle-ui';
import Styles from './TitleRight.less';

export default class TitleRight extends Component {

    static defaultProps = {
        title: ''
    }
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    render() {
        return (
            <Row className="titleRight">
                <Col sm={4}>
                    <span className="spanRight">{this.props.title}</span>
                </Col>
                <Col sm={8}>

                </Col>
            </Row>
        );
    }
}