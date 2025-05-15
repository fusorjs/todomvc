export const memoMap =
  <Key, Value, Result>(
    getResult: (k: Key, v: Value) => Result,
    prev = new Map<Key, Result>(),
  ) =>
  (pairs: Iterable<[Key, Value]>) => {
    const next = new Map<Key, Result>();

    // todo in DEVELOPMENT check dublicates in values and request getKey
    for (const [key, value] of pairs)
      next.set(key, prev.has(key) ? prev.get(key)! : getResult(key, value));

    prev = next;

    return next;
  };
