import {memoizeFunctionShallow} from '@efusor/generic';
import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {createModel} from './model';
import {
  ROUTE_ALL,
  ROUTE_ACTIVE,
  ROUTE_COMPLETED,
  isActive,
  isCompleted,
} from './utils';
import {App} from './App';

let route, app;

const getRouteItemsMem = memoizeFunctionShallow((route, items) => {
  switch (route) {
    case ROUTE_ACTIVE:
      return items.filter(isActive);
    case ROUTE_COMPLETED:
      return items.filter(isCompleted);
    default:
      return items;
  }
});

const storageKey = '@efusor/todomvc';

const todos = createModel(
  (s => (s ? JSON.parse(s) : []))(localStorage.getItem(storageKey)),
  items => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    app.update();
  },
);

app = App({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

document.body.append(app.element);

new Router({
  [ROUTE_ACTIVE]: () => {
    route = ROUTE_ACTIVE;
    app.update();
  },
  [ROUTE_COMPLETED]: () => {
    route = ROUTE_COMPLETED;
    app.update();
  },
})
  .configure({
    notfound: () => {
      route = ROUTE_ALL;
      app.update();
    },
    async: false,
  })
  .init();
