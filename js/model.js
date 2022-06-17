import {areObjectsEqualShallow} from '@efusor/generic';

import {uuid} from './utils';

// class Model {
//   constructor(items) {
//     this.items = items;
//   }
// }

export const createModel = (items, update) => {
  // todo
  // let activeCount = 0;
  // let completedCount = 0;

  const filterIn = predicate => {
    const nextItems = items.filter(predicate);
    if (items.length !== nextItems.length) {
      items = nextItems;
      update(items);
    }
  };

  return {
    create(item) {
      const newItem = {...item, id: uuid()};
      items = [...items, newItem];
      update(items);
    },

    update(id, item) {
      if (item.hasOwnProperty('id'))
        throw new Error(`must not update id: "${id}"`);
      let index;
      const prevItem = items.find((im, ix) => {
        if (im.id === id) {
          index = ix;
          return true;
        }
      });
      if (!prevItem) throw new Error(`missing id: "${id}"`);
      const nextItem = {...prevItem, ...item, id};
      if (!areObjectsEqualShallow(prevItem, nextItem)) {
        items = [...items];
        items[index] = nextItem;
        update(items);
      }
    },

    updateAll(item) {
      if (item.hasOwnProperty('id'))
        throw new Error(`must not update id: "${item.id}"`);
      let areAnyChanged = false;
      const nextItems = items.map(p => {
        const n = {...p, ...item};
        if (!areObjectsEqualShallow(p, n)) areAnyChanged = true;
        return n;
      });
      if (areAnyChanged) {
        items = nextItems;
        update(items);
      }
    },

    remove: id => filterIn(i => i.id !== id),

    filterIn,

    get items() {
      return items;
    },
  };
};
