import {section, input, label, ul} from '@efusor/dom/html';
// import {diffChildren, replaceChildren} from '@perform/dom-other';
import {MemoizeArrayMapShallow} from '@efusor/generic';

import {TodoItem} from './item';

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
    //   () => getRouteItems().map(i => TodoItem({
    //     getItem: () => i,
    //     update,
    //     remove,
    //   })),
    // ),

    // diffChildren(
    //   ul({class: 'todo-list'}),
    //   getItem => TodoItem({
    //     getItem,
    //     update,
    //     remove,
    //   }),
    //   getRouteItems,
    //   'id',
    // ),

    // ul({class: 'todo-list'},
    //   () => getRouteItems().map(todo => TodoItem({
    //     todo
    //     update,
    //     remove,
    //   })),
    // ),

    ul({class: 'todo-list'},
      MemoizeArrayMapShallow(
        getRouteItems,
        todo => TodoItem({
          todo,
          update,
          remove,
        }),
      )
    ),
  )
);
