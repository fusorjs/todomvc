import {getElement, update} from '@fusorjs/dom';
import 'todomvc-app-css/index.css';

import {setAllDataUpdateListener} from './data';

import {App} from './component/App';

const app = App();
const appUpdater = () => update(app);

// Changes that will triger application update:
setAllDataUpdateListener(appUpdater); // adding/editing/removing todo items

document.body.append(getElement(app));
// setTimeout(() => document.body.removeChild(getElement(app), 4000);
