import {update} from '@fusorjs/dom';
import {main, input, label, ul} from '@fusorjs/dom/html';

import {Route, getRoute, subscribeRoute} from '../share/route';
import {
  getData,
  subscribeData,
  Data,
  changeDataCompletion,
  getDataSizes,
  getDataBy,
  ID,
  DataItem,
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
        () =>
          getItems(Object.entries(getRouteData(getRoute())) as [ID, DataItem][])
      )(), // todo entries
    ),
  );

const getRouteData = (route: Route): Data =>
  route === '/' ? getData() : getDataBy(route === '/completed');

const memoMap =
  <Key, Value, Result>(
    getResult: (k: Key, v: Value) => Result,
    // todo getKey
    prevCache = new Map<Key, Result>(),
  ) =>
  // todo iterable
  (values: [Key, Value][]) => {
    // todo DEVELOPMENT check dublicates in values and request getKey
    const nextCache = new Map<Key, Result>();
    const results = values.map(([key, value]) => {
      const result = prevCache.has(key)
        ? prevCache.get(key)!
        : getResult(key, value);
      nextCache.set(key, result);
      return result;
    });
    // console.log(nextCache);
    prevCache = nextCache;
    return results;
  };

const getRouteData = (route: Route): Data =>
  route === '/' ? getData() : getDataBy(route === '/completed');

      return getFilteredDataBy(false);
    case '/completed':
      return getFilteredDataBy(true);
    default:
      return getData();
  }
};
