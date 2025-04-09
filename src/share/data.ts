import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {mountObservable} from '../lib/mountObservable';
import {not} from '../lib/fp';

const STORAGE_KEY = '@fusorjs/todomvc';
const observable = new Observable();

export const getData = () => data;
export const mountData = mountObservable(observable);

//
// This is a non-mutating data model.
//

type ID = string & {distinct: 'ID'};

export interface DataItem {
  id: ID;
  title: string;
  completed: boolean;
}

let data: readonly DataItem[] = (s => (s ? JSON.parse(s) : []))(
  localStorage.getItem(STORAGE_KEY),
);
let activeCountCache = countActive();

const replace = (newData: readonly DataItem[]) => {
  data = newData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  activeCountCache = countActive();
  observable.notify();
};

export const getDataActive = () => activeCountCache;

// replace whole list

export const addDataItem = (newItem: Omit<DataItem, 'id'>) =>
  replace([
    ...data,
    {
      id: uuid() as ID,
      ...newItem,
    },
  ]);

export const removeDataItem = (id: ID) =>
  replace(data.filter(i => i.id !== id));

export const setDataCompleted = (completed: boolean) =>
  replace(data.map(item => ({...item, completed})));

export const removeDataCompleted = () => replace(data.filter(isActive));

// replace one item

export const setDataItemTitle = (id: ID, title: string) =>
  replace(data.map(item => (item.id === id ? {...item, title} : item)));

export const setDataItemCompleted = (id: ID, completed: boolean) =>
  replace(data.map(item => (item.id === id ? {...item, completed} : item)));

// utils

export const isCompleted = ({completed}: DataItem) => completed;

export const isActive = not(isCompleted);

function countActive() {
  return data.reduce((acc, {completed}) => (completed ? acc : acc + 1), 0);
}
