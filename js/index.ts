import 'todomvc-app-css/index.css';

import {setAllDataUpdateListener} from './data';
import {setRouteUpdateListener} from './route';

import {App} from './component/App';

const app = App();
const appUpdater = () => app.update();

// Changes that will triger application update:
setAllDataUpdateListener(appUpdater); // adding/editing/removing todo items
setRouteUpdateListener(appUpdater); // clicking on the All/Active/Completed links

document.body.append(app.element);
