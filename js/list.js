import {section, input, label, ul} from '@perform/dom-element/html';
import {diffChildren, replaceChildren} from '@perform/dom-other';

import {item} from './item';

export const list = ({getRouteItems, update, remove, getCheckedAll, updateAll}) => (
  section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateAll({completed: checked})?.(),
    }),
    label({for: 'toggle-all'}),

    // replaceChildren(
    //   ul({class: 'todo-list'}),
    //   () => getRouteItems().map(i => item({
    //     getItem: () => i,
    //     update,
    //     remove,
    //   })),
    // ),

    diffChildren(
      ul({class: 'todo-list'}),
      getItem => item({
        getItem,
        update,
        remove,
      }),
      getRouteItems,
      'id',
    ),
  )
);
