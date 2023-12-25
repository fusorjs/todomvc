import {ValueListener, ValueObserver} from './valueObserver';

export type PubSubId = string & {distinct: 'PubSubId'};

const getKey = (action: 'add' | 'remove', name: PubSubId) =>
  `_value_observer_${action}_${name}_`;

// todo  + '$e' => getPropSplitter
export const publish = <V>(name: PubSubId, observer: ValueObserver<V>) => {
  return {
    [getKey('add', name) + '$e']: (event: CustomEvent<ValueListener<V>>) => {
      event.stopPropagation();
      observer.addListener(event.detail);
      // console.log(getKey('add', name));
    },
    [getKey('remove', name) + '$e']: (event: CustomEvent<ValueListener<V>>) => {
      event.stopPropagation();
      observer.removeListener(event.detail);
      // console.log(getKey('remove', name));
    },
  };
};

/** returns unsubscribe function */
export const subscribe = <V>(
  name: PubSubId,
  element: Element,
  listener: ValueListener<V>,
) => {
  element.dispatchEvent(
    new CustomEvent(getKey('add', name), {
      detail: listener,
      bubbles: true,
    }),
  );

  return () => {
    element.dispatchEvent(
      new CustomEvent(getKey('remove', name), {
        detail: listener,
        bubbles: true,
      }),
    );
  };
};
