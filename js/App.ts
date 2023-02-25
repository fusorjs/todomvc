import {header, section, h1, input} from '@efusor/dom/html';

import {addDataItem, getAllData} from './data';

import {ListTodos} from './ListTodos';
import {NavBar} from './NavBar';

export const App = () => {
  const onkeydown = (event: KeyboardEvent & Target<HTMLInputElement>) => {
    if (event.code !== 'Enter') return;

    event.preventDefault();

    const title = event.target.value.trim();

    if (title) {
      event.target.value = '';
      addDataItem({
        title,
        completed: false,
      });
    }
  };

  const listTodos = ListTodos();
  const navBar = NavBar();

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
    () => getAllData().length > 0 && listTodos,
    () => getAllData().length > 0 && navBar,
  );
};
