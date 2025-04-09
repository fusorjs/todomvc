export const not =
  <T extends unknown[]>(fn: (...a: T) => boolean) =>
  (...a: T) =>
    !fn(...a);
