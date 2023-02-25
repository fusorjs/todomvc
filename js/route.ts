export type Route = '/' | '/active' | '/completed';

export const getRoute = () => route;

export const setRouteUpdateListener = (callback: typeof updateListener) =>
  (updateListener = callback);

let route: Route = '/';
let updateListener = () => {};

const reroute = () => {
  route = location.hash.substring(1) as Route;

  // sanitize route
  switch (route) {
    case '/':
    case '/active':
    case '/completed':
      break;
    default:
      route = '/';
  }

  updateListener();
};

reroute(); // init route on load

window.addEventListener('popstate', reroute, false);
