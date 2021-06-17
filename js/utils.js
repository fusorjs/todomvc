
export const ROUTE_ALL = '/';
export const ROUTE_ACTIVE = '/active';
export const ROUTE_COMPLETED = '/completed';

export const pluralize = (count, word) => count === 1 ? word : word + 's';

export const isNotCompleted = ({completed}) => ! completed;

export const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
