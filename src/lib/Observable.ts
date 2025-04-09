export type Observer<A extends [] = [], R = unknown> = (...a: A) => R;

export class Observable<A extends [] = [], R = unknown> {
  #callbacks = new Set<Observer<A, R>>();

  notify(...args: A) {
    for (const fn of this.#callbacks) fn(...args);
  }

  subscribe(callback: Observer<A, R>) {
    if (this.#callbacks.has(callback))
      throw new Error('observer already subscribed');

    this.#callbacks.add(callback);

    return () => this.#callbacks.delete(callback); // unsubscribe
  }
}
