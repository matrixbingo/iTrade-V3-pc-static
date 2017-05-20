/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Button} from 'eagle-ui';

export default class Navs extends Component {
    static defaultProps = {
        save: -1,
        next: -1,
        prev: -1,
        callBack: function () {
        },
        nextBack: function () {
        }
    }

    constructor(props) {
        super(props);
    }

    gotoNext(no) {
        this.props.setTabIndex(no);
        this.props.nextBack && this.props.nextBack();
    }

    gotoPrep(no) {
        this.props.setTabIndex(no);
    }

    save() {
        let typeModel = this.props.getValueByReducers('typeModel').toJS();
        if (typeModel.typeId == 0) {
            this.props.showMsgError('请选择分类！');
            return false;
        }
        this.props.callBack && this.props.callBack();
        return true;
    }

    render() {
        const _this = this;
        let saveButton = <Button radius egSize="sm" block onClick={()=>{_this.save()}}
                                 style={{width:'120px'}}>保存</Button>;
        let prevButton = <Button radius egSize="sm" block onClick={_this.gotoPrep.bind(_this, _this.props.prev)}
                                 style={{width:'120px'}}>上一步</Button>;
        let nextButton = <Button radius egSize="sm" block onClick={_this.gotoNext.bind(_this, _this.props.next)}
                                 style={{width:'120px'}}>下一步</Button>;

        if (this.props.save === -1) {
            saveButton = null;
        }
        if (this.props.prev === -1) {
            prevButton = null;
        }
        if (this.props.next === -1) {
            nextButton = null;
        }
        return (
            <Row>
                <Col sm={1}></Col>
                <Col sm={3}>
                    {saveButton}
                </Col>
                <Col sm={3}>
                    {prevButton}
                </Col>
                <Col sm={3}>
                    {nextButton}
                </Col>
                <Col sm={1}></Col>
            </Row>
        );
    }
}
