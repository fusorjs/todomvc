/** Do not forget to check if (a !== b) before calling this function */
export const areArraysEqualShallow = (a: Array<unknown>, b: Array<unknown>) => {
  const {length} = a;

  if (length !== b.length) return false;

  for (let i = 0; i < length; i++) if (a[i] !== b[i]) return false;

  return true;
};

export const memoizeFunctionShallow = <Result>(
  f: (...args: any[]) => Result,
) => {
  let prevArgs: any[], prevResult: Result;

  return (...nextArgs: any[]) => {
    if (prevArgs && areArraysEqualShallow(prevArgs, nextArgs))
      return prevResult;

    prevArgs = nextArgs;
    prevResult = f(...nextArgs);

    return prevResult;
  };
};
