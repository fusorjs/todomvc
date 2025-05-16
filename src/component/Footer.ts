import {update} from '@fusorjs/dom';
import {a} from '@fusorjs/dom/html';
import {footer, span, ul, li, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {getRoute, Route, subscribeRoute, routeRoot} from '../share/route';
import {getDataSizes, removeCompletedData, subscribeData} from '../share/data';

export const Footer = () =>
  footer(
    {
      class: 'footer',
      mount: self => subscribeData(() => update(self)),
    },

    span({class: 'todo-count'}, () => {
      const {active} = getDataSizes();
      return `${active} item${active === 1 ? '' : 's'} left`;
    }),

    ul(
      {class: 'filters'},
      li(RouteLink('All', '/')),
      li(RouteLink('Active', '/active')),
      li(RouteLink('Completed', '/completed')),
    ),

    (
      clearButton => () =>
        getDataSizes().completed > 0 && clearButton
    )(
      button(
        {class: 'clear-completed', click_e: removeCompletedData},
        'Clear completed',
      ),
    ),
  );

const RouteLink = (title: string, route: Route) =>
  a(
    {
      href: routeRoot + route,
      class: () => clsx(getRoute() === route && 'selected'),
      mount: self => subscribeRoute(() => update(self)),
    },
    title,
  );
