import {DataItem} from './data';

export const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';

export const countActive = (acc: number, {completed}: DataItem) =>
  completed ? acc : acc + 1;

export const isActive = ({completed}: DataItem) => !completed;

export const isCompleted = ({completed}: DataItem) => completed;

export const uuid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
