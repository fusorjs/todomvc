import {footer, span, strong, ul, li, a, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {
  getAllTodoItems,
  getNumberOfActiveTodoItems,
  removeAllTodoItemsCompleted,
} from './data';
import {pluralize, ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED} from './utils';

interface Props {
  getRoute: () => string;
}

export const NavBar = ({getRoute}: Props) => {
  const clearButton = button(
    {class: 'clear-completed', onclick: () => removeAllTodoItemsCompleted()},
    'Clear completed',
  );

  return footer(
    {class: 'footer'},
    span(
      {class: 'todo-count'},
      strong(() => getNumberOfActiveTodoItems()),
      () => pluralize(getNumberOfActiveTodoItems(), ' item'),
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
    () =>
      getAllTodoItems().length - getNumberOfActiveTodoItems() > 0 &&
      clearButton,
  );
};
