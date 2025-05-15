import {update} from '@fusorjs/dom';
import {main, input, label, ul} from '@fusorjs/dom/html';

import {memoMap} from '../lib/memoMap';
import {entries} from '../lib/entries';

import {Route, getRoute, subscribeRoute} from '../share/route';
import {
  getData,
  subscribeData,
  Data,
  changeDataCompletion,
  getDataSizes,
  getDataBy,
} from '../share/data';

import {Item} from './Item';

export const Main = () =>
  main(
    {class: 'main'},

    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      change_e: ({target: {checked}}) => changeDataCompletion(checked),
      checked: () => getDataSizes()['active'] === 0,
      mount: self => subscribeData(() => update(self)),
    }),

    label({for: 'toggle-all'}, 'Mark all as complete'),

    ul(
      {
        class: 'todo-list',
        mount: self => {
          const unsubscribe = [
            subscribeRoute(() => update(self)),
            subscribeData(() => update(self)),
          ];
          return () => unsubscribe.forEach(i => i());
        },
      },

      (
        (getItems = memoMap(Item)) =>
        () => [...getItems(entries(getRouteData(getRoute()))).values()]
      )(),
    ),
  );

const getRouteData = (route: Route): Data =>
  route === '/' ? getData() : getDataBy(route === '/completed');

// const xxx = entries({aaa: 111, bbb: 222});
// for (const x of xxx) console.log(x);

// const yyy = entries(getRouteData(getRoute()));
// for (const x of yyy) console.log(x);
