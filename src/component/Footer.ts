import {update} from '@fusorjs/dom';
import {footer, span, ul, li, button} from '@fusorjs/dom/html';

import {getDataSizes, removeCompletedData, subscribeData} from '../share/data';

import {RouteLink} from './RouteLink';

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
      (
        cache = button(
          {class: 'clear-completed', click_e: removeCompletedData},
          'Clear completed',
        ),
      ) =>
      () =>
        getDataSizes()['completed'] > 0 && cache
    )(),
  );
