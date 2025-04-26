/** Check array equality (Shallow) */
const areArraysEqual = (a: Array<unknown>, b: Array<unknown>) => {
  if (a === b) return true;

  const {length} = a;

  if (length !== b.length) return false;

  for (let i = 0; i < length; i++) if (a[i] !== b[i]) return false;

  return true;
};

/** Memoize */
export const memo = <Args extends any[], Result>(
  fn: (...args: Args) => Result,
) => {
  let prev: Args, result: Result;

  return (...next: Args) => {
    if (prev && areArraysEqual(prev, next)) return result;

    prev = next;
    result = fn(...next);

    return result;
  };
};
