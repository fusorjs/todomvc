import {BoundObservable} from '../lib/Observable';

export type Route = '/' | '/active' | '/completed';

const sanitize = (r = location.hash.substring(1)): Route => {
  switch (r) {
    case '/active':
    case '/completed':
      return r;
    default:
      return '/';
  }
};

let route: Route = sanitize();
const observable = new BoundObservable();

window.addEventListener(
  'popstate',
  () => {
    route = sanitize();
    observable.notify();
  },
  false,
);

export const getRoute = () => route;
export const {mount: mountRoute} = observable;
