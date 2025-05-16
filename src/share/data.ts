import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {memo} from '../lib/memo';

export type ID = string & {distinct: 'ID'};

export type DataItem = {
  title: string;
  completed?: true;
};

export type Data = Record<ID, DataItem>;

const API = (() => {
  const STORAGE_KEY = '@fusorjs/todomvc';
  const observable = new Observable();

  let data: Data = (s => (s ? JSON.parse(s) : {}))(
    localStorage.getItem(STORAGE_KEY),
  );

  const count = () => {
    let total = 0;
    let completed = 0;
    for (const key in data) {
      total++;
      if (data[key as ID].completed) completed++;
    }
    return {total, active: total - completed, completed};
  };

  let sizes = count();

  return {
    subscribeData: observable.subscribe.bind(observable),
    getData: (filter => (completed?: boolean) =>
      completed === undefined ? data : filter(data, completed))(
      memo((data: Data, completed: boolean) => {
        const result: Data = {};
        for (const key in data) {
          const item = data[key as ID];
          if (Boolean(item.completed) === completed) result[key as ID] = item;
        }
        return result;
      }),
    ),
    getDataSizes: () => sizes,
    setData: (callback: (data: Data) => Data) => {
      const next = callback(data);
      if (next === data) return;
      data = next;
      sizes = count();
      observable.notify();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
  };
})();

export const {subscribeData, getData, getDataSizes} = API;

const {setData} = API;

export const appendDataItem = (item: DataItem) =>
  setData(data => ({...data, [uuid()]: item}));

export const removeDataItem = (id: ID) =>
  setData(data => {
    if (id in data) {
      data = {...data};
      delete data[id];
    }
    return data;
  });

export const changeDataItem = (id: ID, item: DataItem) =>
  setData(data => {
    if (data[id].title !== item.title || data[id].completed !== item.completed)
      data = {...data, [id]: item};
    return data;
  });

export const changeDataCompletion = (completed: boolean) =>
  setData(data => {
    const next = {...data};
    let changed = false;
    for (const key in next) {
      const item = next[key as ID];
      if (item.completed === completed) continue;
      changed = true;
      next[key as ID] = {...item, completed: completed || undefined};
    }
    if (changed) data = next;
    return data;
  });

export const removeCompletedData = () =>
  setData(data => {
    const next = {...data};
    let changed = false;
    for (const key in next) {
      const {completed} = next[key as ID];
      if (!completed) continue;
      delete next[key as ID];
      changed = true;
    }
    if (changed) data = next;
    return data;
  });
