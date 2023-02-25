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

const getRouteItemsMemoized = memoizeFunctionShallow(
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

// App

let route: string;

const STORAGE_KEY = '@efusor/todomvc';

const todos = new Model(
  (s => (s ? JSON.parse(s) : []))(localStorage.getItem(STORAGE_KEY)),
);

const app = App({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMemoized(route, todos.items),
});

todos.updater = items => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  app.update();
};

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
