import {a} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {getRoute, Route, mountRoute, routeRoot} from '../share/route';

export const RouteLink = (title: string, route: Route) =>
  a(
    {
      href: routeRoot + route,
      class: () => clsx(getRoute() === route && 'selected'),
      mount: mountRoute,
    },
    title,
  );
