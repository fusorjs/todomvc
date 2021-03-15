import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {memF} from '../perform/memF';

import {createTodos} from './model';
import {ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED, getRouteItems} from './utils';
import {app} from './app';

let route;

// todo [getRouteItemsMem, next]
const getRouteItemsMem = memF(getRouteItems);

const todos = createTodos('todos-perform'); // todo next

const render = app({
  todos,
  getRoute: () => route,
  getRouteItems: () => getRouteItemsMem(route, todos.items),
});

document.body.append(render());

const router = Router({
  [ROUTE_ALL]: () => {route = ROUTE_ALL; render()},
  [ROUTE_ACTIVE]: () => {route = ROUTE_ACTIVE; render()},
  [ROUTE_COMPLETED]: () => {route = ROUTE_COMPLETED; render()},
});

router.init(ROUTE_ALL);
