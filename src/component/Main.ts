import {update} from '@fusorjs/dom';
import {main, input, label, ul} from '@fusorjs/dom/html';

import {memoize} from '../lib/memoize';

import {Route, getRoute, subscribeRoute} from '../share/route';
import {
  getData,
  getDataActive,
  setDataCompleted,
  isActive,
  isCompleted,
  subscribeData,
  Data,
} from '../share/data';

import {Item} from './Item';

export const Main = () =>
  main(
    {class: 'main'},

    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      change_e: ({target: {checked}}) => setDataCompleted(checked),
      checked: () => getDataActive() === 0,
      mount: self =>
        subscribeData(({changeActive}) => changeActive && update(self)),
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
          return () => unsubscribe.forEach(i => i()); // todo
        },
      },

      // () => getRouteData(getRoute(), getData()).map(Item),
      // () => getRouteItems(getRoute(), getData()),
      (
        (getItems = memoMap(Item)) =>
        () =>
          getItems(getRouteData(getRoute(), getData()).map(([k, v]) => v))
      )(),
    ),
  );

const memoMap =
  <Value, Result>(
    getResult: (v: Value) => Result,
    // todo getKey
    prevCache = new Map<Value, Result>(),
  ) =>
  // todo iterable
  (values: Value[]) => {
    // todo DEVELOPMENT check dublicates in values and request getKey
    const nextCache = new Map<Value, Result>();
    const results = values.map(value => {
      let result: Result;
      if (prevCache.has(value)) {
        result = prevCache.get(value)!;
      } else result = getResult(value);
      nextCache.set(value, result);
      return result;
    });
    // console.log(nextCache);
    prevCache = nextCache;
    return results;
  };

const getRouteData = (route: Route, data: Data) => {
  switch (route) {
    case '/active':
      return Object.entries(data).filter(([k, v]) => isActive(v));
    case '/completed':
      return Object.entries(data).filter(([k, v]) => isCompleted(v));
    default:
      return Object.entries(data);
  }
};

const getRouteItems = memoize((route: Route, data: Data) =>
  // todo memoize each item, escape updation
  getRouteData(route, data).map(([k, v]) => Item(v)),
);
