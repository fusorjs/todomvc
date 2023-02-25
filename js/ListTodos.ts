import {section, input, label, ul} from '@efusor/dom/html';
// import {diffChildren, replaceChildren} from '@perform/dom-other';
// import {MemoizeArrayMapShallow} from '@efusor/generic';

import {TodoItem} from './TodoItem';
import {Model} from './model';

interface Props {
  todos: Model;
  getRouteItems: () => Todo[];
}

export const ListTodos = ({todos, getRouteItems}: Props) =>
  section(
    {class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked$$: () => todos.active === 0,
      onchange: ({target: {checked}}) => {
        todos.updateCompletedAll(checked);
      },
    }),
    label({for: 'toggle-all'}, 'Mark all as complete'),

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

    // No optimisation
    ul({class: 'todo-list'}, () =>
      getRouteItems().map(todo =>
        TodoItem({
          getItem: () => todo,
          todos,
        }),
      ),
    ),

    // ul(
    //   {class: 'todo-list'},
    //   MemoizeArrayMapShallow(getRouteItems, todo => TodoItem({todo, todos})),
    // ),
  );
