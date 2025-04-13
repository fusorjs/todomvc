import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {not} from '../lib/fp';

export type ID = string & {distinct: 'ID'};
export interface DataItem {
  id: ID;
  title: string;
  completed?: boolean;
}
export type Data = {[k: ID]: DataItem}; // todo remove

interface Action {
  changeLength?: boolean;
  changeActive?: boolean;
  changeItem?: ID | null;
}
const observable = new Observable<[Action]>();
export const subscribeData = observable.subscribe.bind(observable);

const STORAGE_KEY = '@fusorjs/todomvc';
const load = (s = localStorage.getItem(STORAGE_KEY)): Data =>
  s ? JSON.parse(s) : {};
const save = (d: Data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

let data = load();
export const getData = () => data;
let length = 0;
export const getDataLength = () => length;
let active = 0;
export const getDataActive = () => active;
for (const key in data) {
  length++;
  if (!data[key as ID].completed) active++;
}

export const setDataItemTitle = (id: ID, title: string) => {
  if (data[id].title === title) return;
  data = {
    ...data,
    [id]: {
      ...data[id],
      title,
    },
  };
  observable.notify({changeItem: id});
  save(data);
};

export const setDataItemCompleted = (id: ID, completed: boolean) => {
  if (data[id].completed === completed) return;
  if (completed) active--;
  else active++;
  data = {
    ...data,
    [id]: {
      ...data[id],
      completed,
    },
  };
  observable.notify({changeItem: id, changeActive: true});
  save(data);
};

export const addDataItem = (title: DataItem['title']) => {
  length++;
  active++;
  const id = uuid() as ID;
  data = {
    ...data,
    [id]: {id, title},
  };
  observable.notify({changeLength: true, changeActive: true});
  save(data);
};

export const removeDataItem = (id: ID) => {
  length--;
  const {completed} = data[id];
  if (!completed) active--;
  data = {...data};
  delete data[id];
  observable.notify({changeLength: true, changeActive: !completed});
  save(data);
};

export const setDataCompleted = (completed: boolean) => {
  if (completed && active === 0) return;
  active = completed ? 0 : length;
  const next = {...data};
  let changeActive = false;
  for (const key in next) {
    const item = next[key as ID];
    if (item.completed === completed) continue;
    item.completed = completed;
    changeActive = true;
  }
  if (!changeActive) return;
  data = next;
  observable.notify({changeActive, changeItem: null}); // todo changeItem: [...]
  save(data);
};

export const removeDataCompleted = () => {
  if (length === active) return;
  length = active;
  const next = {...data};
  let changeLength = false;
  for (const key in next) {
    const {completed} = next[key as ID];
    if (!completed) continue;
    delete next[key as ID];
    changeLength = true;
  }
  if (!changeLength) return;
  data = next;
  observable.notify({changeLength});
  save(data);
};

export const isCompleted = ({completed}: DataItem) => Boolean(completed);

export const isActive = not(isCompleted);
