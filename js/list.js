import {section, input, label, ul} from '@efusor/dom/html';
// import {diffChildren, replaceChildren} from '@perform/dom-other';

import {item} from './item';

export const TodoList = ({getRouteItems, update, remove, getCheckedAll, updateAll}) => (
  section({class: 'main'}, // todo main tag
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked$$: getCheckedAll,
      onchange: ({target: {checked}}) => updateAll({completed: checked}),
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

    // diffChildren(
    //   ul({class: 'todo-list'}),
    //   getItem => item({
    //     getItem,
    //     update,
    //     remove,
    //   }),
    //   getRouteItems,
    //   'id',
    // ),

    ul({class: 'todo-list'},
      () => getRouteItems().map(i => item({
        todo: i,
        update,
        remove,
      })),
    ),
  )
);
