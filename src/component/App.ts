import {update} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {addDataItem, getDataLength, subscribeData} from '../share/data';

import {Main} from './Main';
import {Footer} from './Footer';

export const App = () =>
  section(
    {
      class: 'todoapp',
      mount: self =>
        subscribeData(({changeLength}) => changeLength && update(self)),
    },

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
            addDataItem(title);
          }
        },
      }),
    ),

    // escape updating recursion
    (
      (cache = [Main(), Footer()]) =>
      () =>
        getDataLength() > 0 && cache
    )(),
  );
