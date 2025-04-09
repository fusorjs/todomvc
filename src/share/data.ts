import {uuid} from '../lib/uuid';
import {Observable} from '../lib/Observable';
import {mountObservable} from '../lib/mountObservable';
import {not} from '../lib/fp';

const STORAGE_KEY = '@fusorjs/todomvc';
const observableList = new Observable();
const observableItem = new Observable<[ID]>();

export const mountData = mountObservable(observableList);
export const subscribeItem = observableItem.subscribe.bind(observableItem);

export type ID = string & {distinct: 'ID'};
export interface DataItem {
  id: ID;
  title: string;
  completed: boolean;
}

export const getData = () => data;
export const getDataActive = () => activeCountCache;

let data: readonly DataItem[] = (s => (s ? JSON.parse(s) : []))(
  localStorage.getItem(STORAGE_KEY),
);
let activeCountCache = countActive();

const replaceAll = (newData: readonly DataItem[]) => {
  data = newData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  activeCountCache = countActive();
  observableList.notify();
};

// replace whole list

export const addDataItem = (newItem: Omit<DataItem, 'id'>) =>
  replaceAll([
    ...data,
    {
      id: uuid() as ID,
      ...newItem,
    },
  ]);

export const removeDataItem = (id: ID) =>
  replaceAll(data.filter(i => i.id !== id));

export const setDataCompleted = (completed: boolean) =>
  replaceAll(data.map(item => ({...item, completed})));

export const removeDataCompleted = () => replaceAll(data.filter(isActive));

// replace one item

export const setDataItemTitle = (id: ID, title: string) =>
  replaceAll(data.map(item => (item.id === id ? {...item, title} : item)));

export const setDataItemCompleted = (id: ID, completed: boolean) =>
  replaceAll(data.map(item => (item.id === id ? {...item, completed} : item)));

// utils

export const isCompleted = ({completed}: DataItem) => completed;

export const isActive = not(isCompleted);

function countActive() {
  return data.reduce((acc, {completed}) => (completed ? acc : acc + 1), 0);
}
