import {countActive, isActive} from './utils';

export class Model {
  #items: readonly Todo[];
  #active?: number;
  updater?: (items: readonly Todo[]) => void;

  constructor(items: readonly Todo[]) {
    this.#items = items;
  }

  #update() {
    this.#active = undefined;
    this.updater?.(this.#items);
  }

  get items() {
    return this.#items;
  }

  get active() {
    this.#active ||= this.#items.reduce(countActive, 0);

    return this.#active;
  }

  add(newItem: Todo) {
    this.#items = [...this.#items, newItem];
    this.#update();
  }

  updateTitle(id: ID, title: string) {
    this.#items = this.#items.map(item =>
      item.id === id ? {...item, title} : item,
    );
    this.#update();
  }

  updateCompleted(id: ID, completed: boolean) {
    this.#items = this.#items.map(item =>
      item.id === id ? {...item, completed} : item,
    );
    this.#update();
  }

  remove(id: ID) {
    this.#items = this.#items.filter(i => i.id !== id);
    this.#update();
  }

  updateCompletedAll(completed: boolean) {
    this.#items = this.#items.map(item => ({...item, completed}));
    this.#update();
  }

  removeCompletedAll() {
    this.#items = this.#items.filter(isActive);
    this.#update();
  }
}
