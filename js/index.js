import {newTodos} from './utils';
import {app} from './app';

let render;

const todos = newTodos('todos-perform');

render = app({todos});

document.body.append(render());
