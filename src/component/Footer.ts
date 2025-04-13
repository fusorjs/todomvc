import {update} from '@fusorjs/dom';
import {footer, span, strong, ul, li, button} from '@fusorjs/dom/html';

import {
  getDataLength,
  getDataActive,
  subscribeData,
  removeDataCompleted,
} from '../share/data';

import {RouteLink} from './RouteLink';

export const Footer = () =>
  footer(
    {
      class: 'footer',
      mount: self =>
        subscribeData(
          ({changeLength, changeActive}) =>
            (changeLength || changeActive) && update(self),
        ),
    },

    span(
      {class: 'todo-count'},
      strong(getDataActive),
      () => pluralize(getDataActive(), ' item'),
      ' left',
    ),

    ul(
      {class: 'filters'},
      li(RouteLink('All', '/')),
      li(RouteLink('Active', '/active')),
      li(RouteLink('Completed', '/completed')),
    ),

    (
      (
        cache = button(
          {class: 'clear-completed', click_e: removeDataCompleted},
          'Clear completed',
        ),
      ) =>
      () =>
        getDataLength() - getDataActive() > 0 && cache
    )(),
  );

const pluralize = (count: number, word: string) =>
  count === 1 ? word : word + 's';
