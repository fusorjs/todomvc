import {memoizeFunctionShallow} from '@efusor/generic';

import 'todomvc-app-css/index.css';

import {
  getAllTodoItems,
  setAllTodoItems,
  setTodoItemsUpdateHandler,
} from './data';
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

setAllTodoItems(
  (s => (s ? JSON.parse(s) : []))(localStorage.getItem(STORAGE_KEY)),
);

const app = App({
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMemoized(route, getAllTodoItems()),
});

setTodoItemsUpdateHandler(items => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  app.update();
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
