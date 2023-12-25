import 'todomvc-app-css/index.css';

import {setAllDataUpdateListener} from './data';

import {App} from './component/App';

const app = App();
const appUpdater = () => app.update();

// Changes that will triger application update:
setAllDataUpdateListener(appUpdater); // adding/editing/removing todo items

document.body.append(app.element);

// setTimeout(() => document.body.append(app.element), 2000);
// setTimeout(() => document.body.removeChild(app.element), 10000);
