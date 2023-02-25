//
// This is non-mutating data model.
//

import {countActive, isActive} from './utils';
import {uuid} from './utils';

export interface DataItem {
  id: ID;
  title: string;
  completed: boolean;
}

export const getAllData = () => data;
export const getAllDataActiveNumber = () => activeNumber;
export const setAllDataUpdateListener = (callback: typeof updateListener) =>
  (updateListener = callback);

export const addDataItem = (newItem: Omit<DataItem, 'id'>) =>
  update([
    ...data,
    {
      id: uuid() as ID,
      ...newItem,
    },
  ]);
export const setDataItemTitle = (id: ID, title: string) =>
  update(data.map(item => (item.id === id ? {...item, title} : item)));
export const setDataItemCompleted = (id: ID, completed: boolean) =>
  update(data.map(item => (item.id === id ? {...item, completed} : item)));
export const removeDataItem = (id: ID) => update(data.filter(i => i.id !== id));

export const setAllDataCompleted = (completed: boolean) =>
  update(data.map(item => ({...item, completed})));
export const removeAllDataCompleted = () => update(data.filter(isActive));

type ID = string & {distinct: 'ID'};

const STORAGE_KEY = '@efusor/todomvc';

let data: readonly DataItem[] = (s => (s ? JSON.parse(s) : []))(
  localStorage.getItem(STORAGE_KEY),
);

let activeNumber = 0;

const updateNumberOfActive = () => (activeNumber = data.reduce(countActive, 0));

updateNumberOfActive(); // initialize

let updateListener = () => {};

const update = (items: readonly DataItem[]) => {
  data = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateNumberOfActive();
  updateListener();
};
