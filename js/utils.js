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

export const areArraysEqual = (a1, a2) => {
  const {length} = a1;

  if (length !== a2.length)
    return false;

  for (let i = 0; i < length; i ++)
    if (a1[i] !== a2[i])
      return false;

  return true;
}

export const memoize = f => {
  let prevArgs, prevResult;

  return (...nextArgs) => {
    if (prevArgs && areArraysEqual(prevArgs, nextArgs))
      return prevResult;

    prevArgs = nextArgs;
    prevResult = f(...nextArgs);

    return prevResult;
  };
};