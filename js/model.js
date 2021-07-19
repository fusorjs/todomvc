import {areObjectsEqualShallow} from '@perform/common/object/equal';

import {uuid} from './utils';

// todo next -> observable
// todo try to propagate changes directly: push/pop/insert/remove... (instead of diff)
export const createModel = (items, next) => {
  const filter = (predicate) => {
    const nextItems = items.filter(predicate);
    if (items.length !== nextItems.length) {
      items = nextItems;
      return next(items);
    }
  };

  return {
    create (item) {
      const newItem = { ...item, id: uuid() };
      items = [...items, newItem];
      return next(items);
    },

    update (id, item) {
      if (item.hasOwnProperty('id')) throw new Error(`must not update id: "${id}"`);
      let index;
      const prevItem = items.find((im, ix) => {
        if (im.id === id) {
          index = ix;
          return true;
        }
      });
      if (! prevItem) throw new Error(`missing id: "${id}"`);
      const nextItem = {...prevItem, ...item, id};
      if (! areObjectsEqualShallow(prevItem, nextItem)) {
        items = [...items];
        items[index] = nextItem;
        return next(items);
      }
    },

    updateAll (item) {
      if (item.hasOwnProperty('id')) throw new Error(`must not update id: "${item.id}"`);
      let areAnyChanged = false;
      const nextItems = items.map(p => {
        const n = {...p, ...item};
        if (! areObjectsEqualShallow(p, n)) areAnyChanged = true;
        return n;
      });
      if (areAnyChanged) {
        items = nextItems;
        return next(items);
      }
    },

    remove: (id) => filter(i => i.id !== id),

    filter,

    get items () {return items;},
  };
};
