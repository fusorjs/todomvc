import {Mount, update} from '@fusorjs/dom';
import {Observable} from './Observable';

export const mountObservable =
  (observable: Observable): Mount =>
  self =>
    observable.subscribe(() => update(self));
