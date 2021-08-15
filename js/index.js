import {memoizeFunction} from '@perform/common';
import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {createModel} from './model';
import {ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED, isNotCompleted} from './utils';
import {app} from './app';

let route, render;

const getRouteItemsMem = memoizeFunction((route, items) => {
  switch (route) {
    case ROUTE_ACTIVE: return items.filter(isNotCompleted);
    case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
    default: return items;
  }
});

const todos = createModel(
  (s => s ? JSON.parse(s) : [])(localStorage.getItem('todos-perform')),
  (items) => () => {
    localStorage.setItem('todos-perform', JSON.stringify(items));
    render();
  },
);

render = app({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

{
  // prevent router to render twice on init

  let element;

  new Router({
    [ROUTE_ACTIVE]: () => {route = ROUTE_ACTIVE; element = render();},
    [ROUTE_COMPLETED]: () => {route = ROUTE_COMPLETED; element = render();},
  }).configure({
    notfound: () => {route = ROUTE_ALL; element = render();},
    async: false,
  }).init();

  document.body.append(element ?? render());
}
