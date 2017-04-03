/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Label,Panel,PanelHeader,PanelContent} from 'eagle-ui';
import InfoRow from './InfoRow.jsx';
import Styles from './InfoRow.less';


export default class InfoList extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="infoList outerPanel marginTopSpace replyContent margin-top-10">
                <Panel className="marginTopSpace">
                    <PanelHeader className="marginSpacePanelHeader">
                        <Row className="background-color province">
                            <Col sm={3} className="">
                                省份
                            </Col>
                            <Col sm={9} >
                                城市
                            </Col>
                        </Row>
                        {this.props.list && <InfoRow {...this.props}/>}
                    </PanelHeader>
                </Panel>
            </div>
        );
    }
}