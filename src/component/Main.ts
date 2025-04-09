import {main, input, label, ul} from '@fusorjs/dom/html';

import {memoizeFunctionShallow} from '../lib/memoize';

import {Route, getRoute, mountRoute} from '../share/route';
import {
  DataItem,
  getData,
  getDataActive,
  setDataCompleted,
  isActive,
  isCompleted,
  mountData,
} from '../share/data';

import {Item} from './Item';

export const Main = () =>
  main(
    {class: 'main', mount: mountData},

    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: () => getDataActive() === 0,
      change_e: ({target: {checked}}) => setDataCompleted(checked),
    }),

    label({for: 'toggle-all'}, 'Mark all as complete'),

    ul(
      {
        class: 'todo-list',
        mount: mountRoute,
      },

      () => getRouteData(getRoute(), getData()).map(Item),
    ),
  );

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

// const getRouteItemsMemoized = memoizeFunctionShallow(
//   (route: Route, items: readonly DataItem[]) =>
//     getRouteData(route, items).map(mapItem),
// );
