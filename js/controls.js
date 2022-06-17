import {footer, span, strong, ul, li, a, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {
  isActive,
  pluralize,
  ROUTE_ALL,
  ROUTE_ACTIVE,
  ROUTE_COMPLETED,
} from './utils';

export const FooterControls = ({
  getActiveCount,
  getCompletedCount,
  getRoute,
  todos,
}) => {
  const clearButton = button(
    {class: 'clear-completed', onclick: () => todos.filterIn(isActive)},
    'Clear completed',
  );

  return footer(
    {class: 'footer'},
    span(
      {class: 'todo-count'},
      strong(getActiveCount),
      pluralize(getActiveCount, ' item'),
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
    () => (getCompletedCount() > 0 ? clearButton : ''),
  );
};
