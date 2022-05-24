
export const ROUTE_ALL = '/';
export const ROUTE_ACTIVE = '/active';
export const ROUTE_COMPLETED = '/completed';

export const pluralize = (count, word) => count === 1 ? word : word + 's';

export const isNotCompleted = ({completed}) => ! completed;

export const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// Do not forget to check if (a !== b) before calling this function.
export const areArraysEqualShallow = (a, b) => {
  const {length} = a;

  if (length !== b.length)
    return false;

  for (let i = 0; i < length; i ++)
    if (a[i] !== b[i])
      return false;

  return true;
};

export const memoizeFunction = f => {
  let prevArgs, prevResult;

  return (...nextArgs) => {
    if (prevArgs && areArraysEqualShallow(prevArgs, nextArgs))
      return prevResult;

    prevArgs = nextArgs;
    prevResult = f(...nextArgs);

    return prevResult;
  };
};

// Do not forget to check if (a !== b) before calling this function.
export const areObjectsEqualShallow = (a, b) => {
  const aKeys = Object.keys(a);
  const {length} = aKeys;

  if (Object.keys(b).length !== length)
    return false;

  for (let i = 0; i < length; i ++) {
    const key = aKeys[i];

    if (a[key] !== b[key])
      return false;
  }

  return true;
};
