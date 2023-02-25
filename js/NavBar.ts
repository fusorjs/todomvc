import {footer, span, strong, ul, li, a, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {
  getAllTodoItems,
  getNumberOfActiveTodoItems,
  removeAllTodoItemsCompleted,
} from './data';
import {getRoute, Route} from './route';
import {pluralize} from './utils';

interface Props {
  name: string;
  route: Route;
}

const RouteLink = ({name, route}: Props) =>
  li(
    a(
      {
        href: `#${route}`,
        class: () => clsx(getRoute() === route && 'selected'),
      },
      name,
    ),
  );

export const NavBar = () => {
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
      RouteLink({name: 'All', route: '/'}),
      RouteLink({name: 'Active', route: '/active'}),
      RouteLink({name: 'Completed', route: '/completed'}),
    ),
    () =>
      getAllTodoItems().length - getNumberOfActiveTodoItems() > 0 &&
      clearButton,
  );
};
