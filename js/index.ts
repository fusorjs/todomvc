import 'todomvc-app-css/index.css';

import {setAllTodoItems, setTodoItemsUpdateHandler} from './data';
import {setRouteUpdateListener} from './route';

import {App} from './App';

// App

const STORAGE_KEY = '@efusor/todomvc';

setAllTodoItems(
  (s => (s ? JSON.parse(s) : []))(localStorage.getItem(STORAGE_KEY)),
);

const app = App();

setTodoItemsUpdateHandler(items => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  app.update();
});

setRouteUpdateListener(() => app.update());

document.body.append(app.element);
