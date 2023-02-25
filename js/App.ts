import {header, section, h1, input} from '@efusor/dom/html';

import {addNewTodoItem, getAllTodoItems} from './data';
import {uuid} from './utils';

import {ListTodos} from './ListTodos';
import {NavBar} from './NavBar';

interface Props {
  getRoute: () => string;
  getRouteItems: () => Todo[];
}

export const App = ({getRoute, getRouteItems}: Props) => {
  const onkeydown = (event: KeyboardEvent & Target<HTMLInputElement>) => {
    if (event.code !== 'Enter') return;

    event.preventDefault();

    const title = event.target.value.trim();

    if (title) {
      event.target.value = '';
      addNewTodoItem({
        id: uuid(),
        title,
        completed: false,
      });
    }
  };

  const listTodos = ListTodos({getRouteItems});

  const navBar = NavBar({getRoute});

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
    () => getAllTodoItems().length > 0 && listTodos,
    () => getAllTodoItems().length > 0 && navBar,
  );
};
