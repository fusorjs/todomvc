import {Component} from '@efusor/dom';
import {memoizeFunctionShallow} from '@efusor/generic';

import 'todomvc-app-css/index.css';

import {Model} from './model';
import {
  ROUTE_ALL,
  ROUTE_ACTIVE,
  ROUTE_COMPLETED,
  isActive,
  isCompleted,
} from './utils';
import {App} from './App';

const getRouteItemsMem = memoizeFunctionShallow(
  (route: string, items: readonly Todo[]) => {
    switch (route) {
      case ROUTE_ACTIVE:
        return items.filter(isActive);
      case ROUTE_COMPLETED:
        return items.filter(isCompleted);
      default:
        return items;
    }
  },
);

// Model

const STORAGE_KEY = '@efusor/todomvc';

let app: Component<Element>;

const todos = new Model(
  (s => (s ? JSON.parse(s) : []))(localStorage.getItem(STORAGE_KEY)),
  items => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    app.update();
  },
);

// App

let route: string;

app = App({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

document.body.append(app.element);

// Router

const reroute = () => {
  route = location.hash.substring(1);

  switch (route) {
    case ROUTE_ALL:
    case ROUTE_ACTIVE:
    case ROUTE_COMPLETED:
      break;
    default:
      route = ROUTE_ALL;
  }

  app.update();
};

reroute(); // init route on load

window.addEventListener('popstate', reroute, false);
