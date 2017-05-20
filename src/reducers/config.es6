import { createReducer } from 'eg-tools';
import Immutable from 'immutable';
import {merge, stroes} from './../utils/utils.es6';
import * as utils from './utils.es6';
import * as trade from './agent/trade.es6';

const data = [utils, trade];

export const config = createReducer('config', Immutable.fromJS(merge(data)), stroes(data));