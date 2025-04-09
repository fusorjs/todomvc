import {Fusion, update} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {addDataItem, getData, mountData} from '../share/data';

import {Main} from './Main';
import {Footer} from './Footer';

export const App = () =>
  section(
    {class: 'todoapp', mount: mountData},

    header(
      {class: 'header'},

      h1('todos'),

      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true,

        keydown_e: event => {
          if ((event as any as KeyboardEvent).code !== 'Enter') return;

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

    (
      (cache?: Fusion[]) => () =>
        getData().length > 0 &&
        (cache ? cache.map(update) : (cache = [Main(), Footer()]))
    )(),
  );
