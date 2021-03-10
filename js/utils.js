import {memoize} from '../perform/memoize';

export const ROUTE_ALL = '/';
export const ROUTE_ACTIVE = '/active';
export const ROUTE_COMPLETED = '/completed';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const newTodos = id => {
  let items = (s => s ? JSON.parse(s) : [])(localStorage.getItem(id));
  const store = () => localStorage.setItem(id, JSON.stringify(items));
  return {
    create (item) {
      items = [...items, {...item, id: uuid()}];
      store();
    },
    update (id, item) {
      let index;
      const curItem = items.find((im, ix) => {
        if (im.id === id) {
          index = ix;
          return true;
        }
      });
      if (! curItem) throw new Error(`missing id: "${id}"`);
      const newItem = {...curItem, ...item, id};
      items = [...items];
      items[index] = newItem;
      store();
    },
    remove (id) {
      items = items.filter(i => i.id !== id);
      store();
    },
    updateAll (item) {
      items = items.map(i => ({...i, ...item, id: i.id}));
      store();
    },
    filter (callback) {
      items = items.filter(callback);
      store();
    },
    get items () {
      return items;
    },
  };
};

export const pluralize = (count, word) => count === 1 ? word : word + 's';

export const isNotCompleted = ({completed}) => ! completed;

export const getVisible = memoize((items, route) => {
  switch (route) {
    case ROUTE_ACTIVE: return items.filter(isNotCompleted);
    case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
    default: return items;
  }
});
