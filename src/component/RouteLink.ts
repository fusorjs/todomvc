import {a} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {getRoute, Route, subscribeRoute, routeRoot} from '../share/route';
import {update} from '@fusorjs/dom';

export const RouteLink = (title: string, route: Route) =>
  a(
    {
      href: routeRoot + route,
      class: () => clsx(getRoute() === route && 'selected'),
      mount: self => subscribeRoute(() => update(self)),
    },
    title,
  );
