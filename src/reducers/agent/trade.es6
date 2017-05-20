import Immutable from 'immutable';
import {actionType} from '../../constants/action-type.es6';

export default {
    param: {
        tradeList: {
            "list": [
                {
                    id: 2228,
                    type: 3,
                    code: "300480",
                    time: 20170203,
                    name: "光力科技",
                    price: 27.61,
                    range: 5.38,
                    speed: 0,
                    stock: 0.6376,
                    buy: 3,
                    sel: 0
                },
                {
                    id: 1617,
                    type: 3,
                    code: "300480",
                    time: 20170125,
                    name: "光力科技",
                    price: 25.8,
                    range: 1.65,
                    speed: 0.12,
                    stock: 0.6376,
                    buy: 4,
                    sel: 0
                },
                {
                    id: 836,
                    type: 3,
                    code: "300480",
                    time: 20170123,
                    name: "光力科技",
                    price: 27.23,
                    range: 4.37,
                    speed: -0.37,
                    stock: 0.6376,
                    buy: 4,
                    sel: 0
                },
                {
                    id: 203,
                    type: 3,
                    code: "300480",
                    time: 20170119,
                    name: "光力科技",
                    price: 25.8,
                    range: 1.65,
                    speed: 0.12,
                    stock: 0.64,
                    buy: 4,
                    sel: 0
                }
            ],
            "totalCount": 20,
            "page": 1,
            "pageSize": 10
        },
        search: {
            "rabin":'0',
            "raend":'11',
            "nums":'0',
            "code": '',
            "name": '',
            "type": 0,
            "bin": '0',
            "end":'0',
            "page": 1,
            "pageSize": 10,
            "sort":'',
            "sortType":'true'
        }
    },
    stroes: {
        [actionType.LOADTRADELIST]: (data, action) => {
            if (action.data && action.data.code == 200) {
                action.data.tradeList = action.data.msg;
                delete action.data.msg;
            }
            return data.merge(Immutable.fromJS(action.data));
        }
    }
};