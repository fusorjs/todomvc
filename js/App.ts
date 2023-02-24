import {header, section, h1, input} from '@efusor/dom/html';

import {ListTodos} from './ListTodos';
import {NavBar} from './NavBar';
import {Model} from './model';
import {uuid} from './utils';

interface Props {
  todos: Model;
  getRoute: () => string;
  getRouteItems: () => Todo[];
}

export const App = ({todos, getRoute, getRouteItems}: Props) => {
  const onkeydown = (event: KeyboardEvent & Target<HTMLInputElement>) => {
    if (event.code !== 'Enter') return;

    event.preventDefault();

    const title = event.target.value.trim();

    if (title) {
      event.target.value = '';
      todos.add({
        id: uuid(),
        title,
        completed: false,
      });
    }
  };

  const listTodos = ListTodos({todos, getRouteItems});

  const navBar = NavBar({todos, getRoute});

  return section(
    {class: 'todoapp'},
    header(
      {class: 'header'},
      h1('todos'),
      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onkeydown,
        autofocus: true,
      }),
    ),
    () => todos.items.length > 0 && listTodos,
    () => todos.items.length > 0 && navBar,
  );
};
