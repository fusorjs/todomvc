import {Fusion, update} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {addDataItem, getAllData} from '../data';

import {List} from './List';
import {Panel} from './Panel';

export const App = () => {
  const list = LazyCached(() => List());
  const panel = LazyCached(() => Panel());

  return section(
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

          const title = event.target.value.trim(); // todo managed

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

    () => getAllData().length > 0 && list(),
    () => getAllData().length > 0 && panel(),
  );
};

/** Prevent first update */
const LazyCached = <T extends Element>(lazy: () => Fusion) => {
  let cache: undefined | Fusion;

  return () => (cache ? update(cache) : (cache = lazy()));
};
