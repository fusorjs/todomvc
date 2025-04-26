import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {memo} from '../lib/memo';

export type ID = string & {distinct: 'ID'};
export type DataItem = {
  title: string;
  completed?: true;
};
export type Data = Record<ID, DataItem>;

const observable = new Observable();
export const subscribeData = observable.subscribe.bind(observable);

const STORAGE_KEY = '@fusorjs/todomvc';
const load = (s = localStorage.getItem(STORAGE_KEY)): Data =>
  s ? JSON.parse(s) : {};
const save = (d: Data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

let data = load();
export const getData = () => data;
export const getDataBy = (() => {
  const get = memo((data: Data, completed: boolean) => {
    const result: Data = {};
    for (const key in data) {
      const item = data[key as ID];
      if (Boolean(item.completed) === completed) result[key as ID] = item;
    }
    return result;
  });
  return (completed: boolean) => get(data, completed);
})();
export const getDataSizes = (() => {
  const get = memo((data: Data) => {
    let total = 0;
    let completed = 0;
    for (const key in data) {
      total++;
      if (data[key as ID].completed) completed++;
    }
    return {total, active: total - completed, completed};
  });
  return () => get(data);
})();

export const appendDataItem = (next: DataItem) => {
  data = {...data, [uuid()]: next};
  observable.notify();
  save(data);
};

export const removeDataItem = (id: ID) => {
  if (!(id in data)) return;
  data = {...data};
  delete data[id];
  observable.notify();
  save(data);
};

export const changeDataItem = (id: ID, next: DataItem) => {
  if (data[id].title === next.title && data[id].completed === next.completed)
    return;
  data = {...data, [id]: next};
  observable.notify();
  save(data);
};

export const changeDataCompletion = (completed: boolean) => {
  const next = {...data};
  let changed = false;
  for (const key in next) {
    const item = next[key as ID];
    if (item.completed === completed) continue;
    changed = true;
    next[key as ID] = {...item, completed: completed || undefined};
  }
  if (!changed) return;
  data = next;
  observable.notify();
  save(data);
};

export const removeCompletedData = () => {
  const next = {...data};
  let changed = false;
  for (const key in next) {
    const {completed} = next[key as ID];
    if (!completed) continue;
    delete next[key as ID];
    changed = true;
  }
  if (!changed) return;
  data = next;
  observable.notify();
  save(data);
};
