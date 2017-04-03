/**
 * Created by liang.wang on 16/5/10.
 */
import React, { Component ,PropTypes} from 'react';
import {Row,Col,Button} from 'eagle-ui';
import Styles from './InfoRow.less';
import classNames from 'classnames';

export default class InfoRow extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    createCities(cities){
        let rs = [], city;
        for(let i in cities){
            city = cities[i];
            if(i == 0){
                city = city.cityName;
            }else{
                city = ' ' + city.cityName;
            }
            rs.push(city);
        }
        return rs;
    }

    createRow(){
        let rs = [];
        const list = this.props.list.toJS();
        let rowNo = 1;
        for(let i in list){
            const item = list[i];
            let rowColor = rowNo % 2 == 0 ? 'row-color-odd' : 'row-color-eve';
            rowNo++;
            rs.push(<Row className={rowColor}>
                <Col sm={3} className="province">
                    {item.provinceName}
                </Col>
                <Col sm={9} className="col-left-border">
                    {this.createCities(item.cities)}
                </Col>
            </Row>);
        }
        return rs;
    }

    render() {
        return (
            <div className="infoRow">
                {this.createRow()}
            </div>
        );
    }
}