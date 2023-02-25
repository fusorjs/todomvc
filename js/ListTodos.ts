import {section, input, label, ul} from '@efusor/dom/html';
// import {diffChildren, replaceChildren} from '@perform/dom-other';
// import {MemoizeArrayMapShallow} from '@efusor/generic';

import {getNumberOfActiveTodoItems, setAllTodoItemsCompleted} from './data';

import {TodoItem} from './TodoItem';

interface Props {
  getRouteItems: () => Todo[];
}

export const ListTodos = ({getRouteItems}: Props) =>
  section(
    {class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked$$: () => getNumberOfActiveTodoItems() === 0,
      onchange: ({target: {checked}}) => setAllTodoItemsCompleted(checked),
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
        }),
      ),
    ),

    // ul(
    //   {class: 'todo-list'},
    //   MemoizeArrayMapShallow(getRouteItems, todo => TodoItem({todo, todos})),
    // ),
  );
