import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {mountObservable} from '../lib/mountObservable';
import {not} from '../lib/fp';

//
// This is a non-mutating data model.
//

type ID = string & {distinct: 'ID'};

export interface DataItem {
  id: ID;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = '@fusorjs/todomvc';
const dataObservable = new Observable();

let data: readonly DataItem[] = (s => (s ? JSON.parse(s) : []))(
  localStorage.getItem(STORAGE_KEY),
);
let activeCountCache = countActive();

const update = (newData: readonly DataItem[]) => {
  data = newData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  activeCountCache = countActive();
  dataObservable.notify();
};

// whole data

export const getData = () => data;

export const mountData = mountObservable(dataObservable);

export const activeDataCount = () => activeCountCache;

export const setDataCompleted = (completed: boolean) =>
  update(data.map(item => ({...item, completed})));

export const removeDataCompleted = () => update(data.filter(isActive));

// one data item

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

// utils

export const isCompleted = ({completed}: DataItem) => completed;

export const isActive = not(isCompleted);

function countActive() {
  return data.reduce((acc, {completed}) => (completed ? acc : acc + 1), 0);
}
