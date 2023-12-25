export type ValueListener<V> = (value: V) => void;

export class ValueObserver<V> {
  private listeners: Set<ValueListener<V>>;

  constructor() {
    this.listeners = new Set();
  }

  addListener(listener: ValueListener<V>) {
    if (process.env.NODE_ENV === 'development') {
      if (this.listeners.has(listener))
        throw new Error('listener already added');
    }

    this.listeners.add(listener);
  }

  removeListener(listener: ValueListener<V>) {
    if (process.env.NODE_ENV === 'development') {
      if (!this.listeners.has(listener))
        throw new Error('listener already removed');
    }

    this.listeners.delete(listener);
  }

  setValue(value: V) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
