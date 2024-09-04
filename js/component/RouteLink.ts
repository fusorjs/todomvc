import {li, a} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {getRoute, Route, mountRoute} from '../share/route';

export const RouteLink = (title: string, route: Route) =>
  li(
    a(
      {
        href: `#${route}`,
        class: () => clsx(getRoute() === route && 'selected'),
        mount: mountRoute,
      },
      title,
    ),
  );
