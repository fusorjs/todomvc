import {memF} from '@perform/core/helpers';
import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {createTodos} from './model';
import {ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED, isNotCompleted} from './utils';
import {app} from './app';

let route, render;

// todo [getRouteItemsMem, next]
const getRouteItemsMem = memF((route, items) => {
  switch (route) {
    case ROUTE_ACTIVE: return items.filter(isNotCompleted);
    case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
    default: return items;
  }
});

const todos = createTodos('todos-perform', () => render); // todo next

render = app({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

{
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
