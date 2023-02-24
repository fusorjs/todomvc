export const ROUTE_ALL = '/';
export const ROUTE_ACTIVE = '/active';
export const ROUTE_COMPLETED = '/completed';

export const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';

export const countActive = (acc: number, {completed}: Todo) =>
  completed ? acc : acc + 1;

export const isActive = ({completed}: Todo) => !completed;

export const isCompleted = ({completed}: Todo) => completed;

export const uuid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
