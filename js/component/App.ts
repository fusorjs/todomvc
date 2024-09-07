import {Fusion, update} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {addDataItem, getAllData} from '../data';

import {List} from './List';
import {Panel} from './Panel';

export const App = () =>
  section(
    {class: 'todoapp'},

    header(
      {class: 'header'},

      h1('todos'),

      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true,

        keydown_e: (event: KeyboardEvent & Target<HTMLInputElement>) => {
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

    // prevent creation and updating on the first run
    (
      (c?: Fusion[]) => () =>
        getAllData().length > 0 && (c ? c.map(update) : (c = [List(), Panel()]))
    )(),
  );
