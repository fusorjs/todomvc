import {Component} from '@fusorjs/dom';
import {footer, span, strong, ul, li, a, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {subscribe} from '../lib/publishSubscribe';

import {Route, routeId} from '../share';
import {
  getAllData,
  getAllDataActiveNumber,
  removeAllDataCompleted,
} from '../data';

export const Panel = () => {
  // cache it, so it won't be re-created on every Panel update, it is static button // todo should typecheck to be static
  const clearButton = button(
    {class: 'clear-completed', click$e: () => removeAllDataCompleted()},
    'Clear completed',
  );

  let route: Route;
  const getRoute = () => route;

  return footer(
    {
      class: 'footer',
      mount: (self: Component<Element>) => {
        return subscribe(routeId, self.element, (r: Route) => {
          route = r;
          self.update();
        });
      },
    },

    span(
      {class: 'todo-count'},
      strong(() => getAllDataActiveNumber()),
      () => pluralize(getAllDataActiveNumber(), ' item'),
      ' left',
    ),
    ul(
      {class: 'filters'},
      Link({name: 'All', route: '/', getRoute}),
      Link({name: 'Active', route: '/active', getRoute}),
      Link({name: 'Completed', route: '/completed', getRoute}),
    ),
    () => getAllData().length - getAllDataActiveNumber() > 0 && clearButton,
  );
};

const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';

interface LinkProps {
  name: string;
  route: string;
  getRoute: () => string;
}

const Link = ({name, route, getRoute}: LinkProps) =>
  li(
    a(
      {
        href: `#${route}`,
        // todo class$subscribe$route: (r) => clsx(r === route && 'selected'),
        class: () => clsx(getRoute() === route && 'selected'),
      },
      name,
    ),
  );
