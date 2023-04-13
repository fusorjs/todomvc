import {Component} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {addDataItem, getAllData} from '../data';

import {List} from './List';
import {Panel} from './Panel';

export const App = () => {
  // cache components, >to not re-created them on every App update
  let list: undefined | Component<HTMLElement>;
  let panel: undefined | Component<HTMLElement>;

  return section(
    {class: 'todoapp'},
    header(
      {class: 'header'},
      h1('todos'),

      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true,

        keydown$e: (event: KeyboardEvent & Target<HTMLInputElement>) => {
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
        },
      }),
    ),

    () => getAllData().length > 0 && (list?.update() ?? (list = List())),
    () => getAllData().length > 0 && (panel?.update() ?? (panel = Panel())),
  );
};
