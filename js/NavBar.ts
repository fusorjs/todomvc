import {footer, span, strong, ul, li, a, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {Model} from './model';

import {
  isActive,
  pluralize,
  ROUTE_ALL,
  ROUTE_ACTIVE,
  ROUTE_COMPLETED,
} from './utils';

interface Props {
  todos: Model;
  getRoute: () => string;
}

export const NavBar = ({todos, getRoute}: Props) => {
  const clearButton = button(
    {class: 'clear-completed', onclick: () => todos.removeCompletedAll()},
    'Clear completed',
  );

  return footer(
    {class: 'footer'},
    span(
      {class: 'todo-count'},
      strong(() => todos.active),
      () => pluralize(todos.active, ' item'),
      ' left',
    ),
    ul(
      {class: 'filters'},
      li(
        a(
          {
            href: `#${ROUTE_ALL}`,
            class: () => clsx(getRoute() === ROUTE_ALL && 'selected'),
          },
          'All',
        ),
      ),
      li(
        a(
          {
            href: `#${ROUTE_ACTIVE}`,
            class: () => clsx(getRoute() === ROUTE_ACTIVE && 'selected'),
          },
          'Active',
        ),
      ),
      li(
        a(
          {
            href: `#${ROUTE_COMPLETED}`,
            class: () => clsx(getRoute() === ROUTE_COMPLETED && 'selected'),
          },
          'Completed',
        ),
      ),
    ),
    () => todos.items.length - todos.active > 0 && clearButton,
  );
};
