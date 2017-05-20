/**
 * Created by liang.wang on 16/9/29.
 */
import React, { Component ,PropTypes} from 'react';
import {bindingMixin} from 'eg-tools';
import ReactHighcharts from 'react-highcharts';

export default
class Chart extends Component {
    static defaultProps = {
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const config = {
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
            }]
        };
        return (
            <div>
                <ReactHighcharts config = {config}></ReactHighcharts>
            </div>
        )

    }
}
