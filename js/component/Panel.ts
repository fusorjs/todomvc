import {footer, span, strong, ul, button} from '@fusorjs/dom/html';

import {
  getAllData,
  getAllDataActiveNumber,
  removeAllDataCompleted,
} from '../data';

import {RouteLink} from './RouteLink';

export const Panel = () => {
  // cache it, so it won't be re-created on every Panel update, it is static button // todo should typecheck to be static
  const clearButton = button(
    {class: 'clear-completed', click$e: () => removeAllDataCompleted()},
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
      RouteLink('All', '/'),
      RouteLink('Active', '/active'),
      RouteLink('Completed', '/completed'),
    ),

    () => getAllData().length - getAllDataActiveNumber() > 0 && clearButton,
  );
};

const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';
