import {h} from './perform';

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
      Object.assign([], items, {[index]: newItem});
    },
    setTitle (index, title) {
      items[index] = {...items[index], title};
      store();
    },
    setCompleted (index, completed) {
      items[index] = {...items[index], completed};
      store();
    },
    setAllCompleted (completed) {
      items = items.map(i => ({...i, completed}));
      store();
    },
    remove (index) {
      items.splice(index, 1);
      store();
    },
    removeAllCompleted () {
      items = items.filter(({completed}) => ! completed);
      store();
    },
    getLength: () => items.length,
    map: (...a) => items.map(...a),
    filter: (...a) => items.filter(...a),
    reduce: (...a) => items.reduce(...a),
  };
};

export const pluralize = (count, word) => count === 1 ? word : word + 's';

export const div = (...a) => h('div', ...a);
export const span = (...a) => h('span', ...a);
export const strong = (...a) => h('strong', ...a);
export const a = (...a) => h('a', ...a);
export const ul = (...a) => h('ul', ...a);
export const li = (...a) => h('li', ...a);
export const h1 = (...a) => h('h1', ...a);
export const input = (...a) => h('input', ...a);
export const label = (...a) => h('label', ...a);
export const button = (...a) => h('button', ...a);
export const header = (...a) => h('header', ...a);
export const section = (...a) => h('section', ...a);
export const footer = (...a) => h('footer', ...a);
