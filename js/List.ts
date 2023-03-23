import {section, input, label, ul} from '@fusorjs/dom/html';
// import {memoizeFunctionShallow} from '@fusorjs/generic';
// import {diffChildren} from '@fusorjs/dom-other';
// import {replaceChildren} from '@fusorjs/dom-other';
// import {MemoizeArrayMapShallow} from '@fusorjs/generic';

import {memoizeFunctionShallow} from './lib';

import {
  DataItem,
  getAllData,
  getAllDataActiveNumber,
  setAllDataCompleted,
  isActive,
} from './data';
import {getRoute, Route} from './route';

import {Item} from './Item';

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

    //
    // Please note, the following code contains various array optimisation techniques.
    // Uncomment the apropriate solution and see how it behaves in your DOM Inspector.
    //

    /**
     * No optimisation.
     * Each Item component/element will be recreated on every application update.
     */
    // ul({class: 'todo-list'}, () =>
    //   getRouteData(getRoute(), getAllData()).map(mapItem),
    // ),

    /**
     * Not recreate items when switching to the same route.
     * Try clicking on one of All/Active/Completed links multiple times.
     */
    ul({class: 'todo-list'}, () =>
      getRouteItemsMemoized(getRoute(), getAllData()),
    ),

    /**
     * Not available, experimental.
     */
    // replaceChildren(
    //   ul({class: 'todo-list'}),
    //   () => getRouteItems().map(i => TodoItem({
    //     getItem: () => i,
    //     update,
    //     remove,
    //   })),
    // ),

    /**
     * Not available, experimental.
     */
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

    /**
     * Not available, experimental.
     */
    // ul(
    //   {class: 'todo-list'},
    //   MemoizeArrayMapShallow(getRouteItems, todo => TodoItem({todo, todos})),
    // ),
  );

const mapItem = (value: DataItem) =>
  Item({
    getValue: () => value,
  });

const isCompleted = ({completed}: DataItem) => completed;

const getRouteData = (route: Route, data: readonly DataItem[]) => {
  switch (route) {
    case '/active':
      return data.filter(isActive);
    case '/completed':
      return data.filter(isCompleted);
    default:
      return data;
  }
};

const getRouteItemsMemoized = memoizeFunctionShallow(
  (route: Route, items: readonly DataItem[]) =>
    getRouteData(route, items).map(mapItem),
);
