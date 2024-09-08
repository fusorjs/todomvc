import {section, input, label, ul} from '@fusorjs/dom/html';

import {memoizeFunctionShallow} from '../lib/memoize';

import {Route, getRoute, mountRoute} from '../share/route';
import {
  DataItem,
  getData,
  activeDataCount,
  setDataCompleted,
  isActive,
  isCompleted,
} from '../share/data';

import {Item} from './Item';

export const List = () =>
  section(
    {class: 'main'},

    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: () => activeDataCount() === 0,
      change_e: ({target: {checked}}: Target<HTMLInputElement>) =>
        setDataCompleted(checked),
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
    ul(
      {
        class: 'todo-list',
        mount: mountRoute,
      },

      () => getRouteItemsMemoized(getRoute(), getData()),
    ),
  );

const mapItem = (value: DataItem) =>
  Item({
    getValue: () => value,
  });

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
