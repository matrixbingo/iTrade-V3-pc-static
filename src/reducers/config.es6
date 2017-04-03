import { createReducer } from 'eg-tools';
import Immutable from 'immutable';
import {merge, stroes} from './../utils/utils.es6';
import * as utils from './utils.es6';
import * as corporation from './agent/corporation.es6';
import * as transfor from './agent/transfor.es6';
import * as employees from './agent/employees.es6';
import * as contact from './agent/contact.es6';
import * as power from './agent/power.es6';
import * as cooperation from './agent/cooperation.es6';
import * as validate from './agent/validate.es6';
import * as _public from './agent/public.es6';

const data = [utils, corporation, transfor, employees, contact, power, cooperation, validate, _public];

export const config = createReducer('config', Immutable.fromJS(merge(data)), stroes(data));