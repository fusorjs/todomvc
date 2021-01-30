import {h} from './perform';

export const newTodos = id => {
  const items = (s => s ? JSON.parse(s) : [])(localStorage.getItem(id));
  const store = () => localStorage.setItem(id, JSON.stringify(items));
  return {
    add (item) {
      items.push(item);
      store();
    },
    setTitle (index, title) {
      items[index] = {...items[index], title};
      store();
    },
    setCompleted (index, completed) {
      items[index] = {...items[index], completed};
      store();
    },
    remove (index) {
      items.splice(index, 1);
      store();
    },
    getLength: () => items.length,
    map: f => items.map(f),
  };
};

export const div = (...a) => h('div', ...a);
export const ul = (...a) => h('ul', ...a);
export const li = (...a) => h('li', ...a);
export const h1 = (...a) => h('h1', ...a);
export const input = (...a) => h('input', ...a);
export const label = (...a) => h('label', ...a);
export const button = (...a) => h('button', ...a);
export const header = (...a) => h('header', ...a);
export const section = (...a) => h('section', ...a);