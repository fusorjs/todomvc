import {Mount, update} from '@fusorjs/dom';
import {Observable} from './Observable';

/** @deprecated */
export const mountObservable =
  (observable: Observable): Mount =>
  self =>
    observable.subscribe(() => update(self));
