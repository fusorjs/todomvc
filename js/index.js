import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {memoizeFunction} from './utils';

import {createModel} from './model';
import {ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED, isNotCompleted} from './utils';
import {App} from './app';

let route, app;

const getRouteItemsMem = memoizeFunction((route, items) => {
  switch (route) {
    case ROUTE_ACTIVE: return items.filter(isNotCompleted);
    case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
    default: return items;
  }
});

const storageKey = '@efusor/todomvc';

const todos = createModel(
  (s => s ? JSON.parse(s) : [])(localStorage.getItem(storageKey)),
  (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    app.update();
  },
);

app = App({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

document.body.append(app.getElement());

new Router({
  [ROUTE_ACTIVE]: () => {route = ROUTE_ACTIVE; app.update();},
  [ROUTE_COMPLETED]: () => {route = ROUTE_COMPLETED; app.update();},
}).configure({
  notfound: () => {route = ROUTE_ALL; app.update();},
  async: false,
}).init();
