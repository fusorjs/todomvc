import {Observable} from '../lib/Observable';

const observable = new Observable();

export type Route = '/' | '/active' | '/completed';
export const getRoute = () => route;
export const subscribeRoute = observable.subscribe.bind(observable);

export const routeRoot = '#';

const readRoute = (r = location.hash.substring(1)): Route => {
  switch (r) {
    case '/active':
    case '/completed':
      return r;
  }

  return '/';
};

let route: Route = readRoute();

window.addEventListener(
  'popstate',
  () => {
    const next = readRoute();

    if (route === next) return;

    route = next;
    observable.notify();
  },
  false,
);
