import {Router} from 'director/build/director';
import 'todomvc-app-css/index.css';

import {newTodos} from './model';
import {ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED} from './utils';
import {app} from './app';

let render, route;

const todos = newTodos('todos-perform');

render = app({todos, getRoute: () => route});

document.body.append(render());

const router = Router({
  [ROUTE_ALL]: () => {route = ROUTE_ALL; render()},
  [ROUTE_ACTIVE]: () => {route = ROUTE_ACTIVE; render()},
  [ROUTE_COMPLETED]: () => {route = ROUTE_COMPLETED; render()},
});

router.init(ROUTE_ALL);
