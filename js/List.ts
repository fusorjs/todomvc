import {section, input, label, ul} from '@efusor/dom/html';
import {memoizeFunctionShallow} from '@efusor/generic';
// import {diffChildren} from '@perform/dom-other';
// import {replaceChildren} from '@perform/dom-other';
// import {MemoizeArrayMapShallow} from '@efusor/generic';

import {
  DataItem,
  getAllData,
  getAllDataActiveNumber,
  setAllDataCompleted,
  isActive,
} from './data';
import {getRoute, Route} from './route';

import {Item} from './Item';

const isCompleted = ({completed}: DataItem) => completed;

const getRouteItemsMemoized = memoizeFunctionShallow(
  (route: Route, items: readonly DataItem[]) => {
    switch (route) {
      case '/active':
        return items.filter(isActive);
      case '/completed':
        return items.filter(isCompleted);
      default:
        return items;
    }
  },
);

export const List = () =>
  section(
    {class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked$$: () => getAllDataActiveNumber() === 0,
      onchange: ({target: {checked}}) => setAllDataCompleted(checked),
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
      getRouteItemsMemoized(getRoute(), getAllData()).map(todo =>
        Item({
          getValue: () => todo,
        }),
      ),
    ),

    // ul(
    //   {class: 'todo-list'},
    //   MemoizeArrayMapShallow(getRouteItems, todo => TodoItem({todo, todos})),
    // ),
  );
