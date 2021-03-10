import {memoize} from '../perform/memoize';

export const ROUTE_ALL = '/';
export const ROUTE_ACTIVE = '/active';
export const ROUTE_COMPLETED = '/completed';

export const pluralize = (count, word) => count === 1 ? word : word + 's';

export const isNotCompleted = ({completed}) => ! completed;

export const getVisible = memoize((items, route) => {
  switch (route) {
    case ROUTE_ACTIVE: return items.filter(isNotCompleted);
    case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
    default: return items;
  }
});
