import 'todomvc-app-css/index.css';

import {setAllDataUpdateListener} from './data';
import {setRouteUpdateListener} from './route';

import {App} from './App';

// App

const app = App();
const appUpdater = () => app.update();

setAllDataUpdateListener(appUpdater);
setRouteUpdateListener(appUpdater);

document.body.append(app.element);
