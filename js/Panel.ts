import {footer, span, strong, ul, li, a, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {
  getAllData,
  getAllDataActiveNumber,
  removeAllDataCompleted,
} from './data';
import {getRoute, Route} from './route';

export const Panel = () => {
  // cache it, so it won't be recreated on every Panel update
  const clearButton = button(
    {class: 'clear-completed', onclick: () => removeAllDataCompleted()},
    'Clear completed',
  );

  return footer(
    {class: 'footer'},
    span(
      {class: 'todo-count'},
      strong(() => getAllDataActiveNumber()),
      () => pluralize(getAllDataActiveNumber(), ' item'),
      ' left',
    ),
    ul(
      {class: 'filters'},
      Link({name: 'All', route: '/'}),
      Link({name: 'Active', route: '/active'}),
      Link({name: 'Completed', route: '/completed'}),
    ),
    () => getAllData().length - getAllDataActiveNumber() > 0 && clearButton,
  );
};

const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';

interface LinkProps {
  name: string;
  route: Route;
}

const Link = ({name, route}: LinkProps) =>
  li(
    a(
      {
        href: `#${route}`,
        class: () => clsx(getRoute() === route && 'selected'),
      },
      name,
    ),
  );
