import {footer, span, strong, ul, button} from '@fusorjs/dom/html';

import {getData, activeDataCount, removeDataCompleted} from '../share/data';

import {RouteLink} from './RouteLink';

export const Panel = () =>
  footer(
    {class: 'footer'},

    span(
      {class: 'todo-count'},
      strong(activeDataCount),
      () => pluralize(activeDataCount(), ' item'),
      ' left',
    ),

    ul(
      {class: 'filters'},
      RouteLink('All', '/'),
      RouteLink('Active', '/active'),
      RouteLink('Completed', '/completed'),
    ),

    (
      (
        cache = button(
          {class: 'clear-completed', click_e: removeDataCompleted},
          'Clear completed',
        ),
      ) =>
      () =>
        getData().length - activeDataCount() > 0 && cache
    )(),
  );

const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';
