import {update} from '@fusorjs/dom';
import {main, input, label, ul} from '@fusorjs/dom/html';

import {memoMap} from '../lib/memoMap';
import {entries} from '../lib/entries';

import {getRoute, subscribeRoute} from '../share/route';
import {
  getData,
  subscribeData,
  changeDataCompletion,
  getDataSizes,
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
      checked: () => getDataSizes().active === 0,
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

      (getItems => () => [
        ...getItems(
          entries(
            getData(
              (route => (route === '/' ? undefined : route === '/completed'))(
                getRoute(),
              ),
            ),
          ),
        ).values(),
      ])(memoMap(Item)),
    ),
  );
