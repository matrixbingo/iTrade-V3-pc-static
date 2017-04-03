import * as UtilsAction from './utils.es6';
import * as CorporationAction from './corporationAction.es6';
import * as ContactAction from './contactAction.es6';
import * as EmployeAction from './employeAction.es6';
import * as PublicAction from './publicAction.es6';

export default {...PublicAction, ...EmployeAction, ...ContactAction, ...CorporationAction, ...UtilsAction};
