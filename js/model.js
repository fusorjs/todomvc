import {areObjectsEqualShallow} from '@perform/core/helpers/object/equal';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// todo next observable
export const createTodos = (id, next) => {
  let items = (s => s ? JSON.parse(s) : [])(localStorage.getItem(id));

  const store = () => localStorage.setItem(id, JSON.stringify(items));

  const filter = (predicate) => {
    const nextItems = items.filter(predicate);
    if (items.length !== nextItems.length) {
      items = nextItems;
      store();
      return next();
    }
  };

  return {
    create (item) {
      const newItem = { ...item, id: uuid() };
      items = [...items, newItem];
      store();
      return next();
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
        store();
        return next();
      }
    },

    updateAll (item) {
      if (item.hasOwnProperty('id')) throw new Error(`must not update id: "${id}"`);
      let areAnyChanged = false;
      const nextItems = items.map(p => {
        const n = {...p, ...item};
        if (! areObjectsEqualShallow(p, n)) areAnyChanged = true;
        return n;
      });
      if (areAnyChanged) {
        items = nextItems;
        store();
        return next();
      }
    },

    remove: (id) => filter(i => i.id !== id),

    filter,

    get items () {return items;},
  };
};
