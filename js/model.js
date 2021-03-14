
const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// todo jsonpatch compatible:
// return patch in actions if value has chnged or undefined otherwise
// or make observable

export const createTodos = id => {
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
      // todo check if changed
      items = [...items];
      items[index] = newItem;
      store();
    },

    remove (id) {
      items = items.filter(i => i.id !== id);
      store();
    },

    updateAll (item) {
      // todo check if changed each item
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
