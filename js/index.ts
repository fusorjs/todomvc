import {getElement} from '@fusorjs/dom';
import 'todomvc-app-css/index.css';

import {App} from './component/App';

const app = App();

document.body.append(getElement(app));

// setTimeout(() => document.body.removeChild(getElement(app), 5000);
