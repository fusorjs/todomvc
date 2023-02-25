//
// This is non mutating data model
//

import {countActive, isActive} from './utils';

// All todo items

let allTodoItems: readonly Todo[] = [];

export const setAllTodoItems = (items: readonly Todo[]) => {
  allTodoItems = items;
  updateNumberOfActive();
};

export const getAllTodoItems = () => allTodoItems;

// Number of active todo items

let numberOfActive = 0;

export const getNumberOfActiveTodoItems = () => numberOfActive;

const updateNumberOfActive = () =>
  (numberOfActive = allTodoItems.reduce(countActive, 0));

// Client update handeler

let clientUpdater: undefined | ((items: readonly Todo[]) => void);

export const setTodoItemsUpdateHandler = (callback: typeof clientUpdater) =>
  (clientUpdater = callback);

// Data updating functions

const updateHelper = (items: readonly Todo[]) => {
  allTodoItems = items;
  updateNumberOfActive();
  clientUpdater?.(allTodoItems);
};

// One item actions

export const addNewTodoItem = (newItem: Todo) =>
  updateHelper([...allTodoItems, newItem]);

export const setTodoItemTitle = (id: ID, title: string) =>
  updateHelper(
    allTodoItems.map(item => (item.id === id ? {...item, title} : item)),
  );

export const setTodoItemCompleted = (id: ID, completed: boolean) =>
  updateHelper(
    allTodoItems.map(item => (item.id === id ? {...item, completed} : item)),
  );

export const removeTodoItem = (id: ID) =>
  updateHelper(allTodoItems.filter(i => i.id !== id));

// Many items actions

export const setAllTodoItemsCompleted = (completed: boolean) =>
  updateHelper(allTodoItems.map(item => ({...item, completed})));

export const removeAllTodoItemsCompleted = () =>
  updateHelper(allTodoItems.filter(isActive));
