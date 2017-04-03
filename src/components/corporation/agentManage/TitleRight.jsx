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
                <Col sm={3}></Col>
                <Col sm={9} className="title-col">
                    {this.props.title}
                </Col>
            </Row>
        );
    }
}