import cs from 'clsx';
import {
  pluralize, ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED,
  footer, span, strong, ul, li, a, button,
} from './utils';

export const controls = ({getActiveCount, getCompletedCount, getRoute, clearCompleted}) => {
  let render;

  const renderButton = button({class: 'clear-completed', onclick: clearCompleted},
    'Clear completed',
  );

  return render = footer({class: 'footer'},
    span({class: 'todo-count'}, strong(getActiveCount), pluralize(getActiveCount, ' item'), ' left'),
    ul({class: 'filters'},
      li(a({href: `#${ROUTE_ALL}`, class: () => cs(getRoute() === ROUTE_ALL && 'selected')}, 'All')),
      li(a({href: `#${ROUTE_ACTIVE}`, class: () => cs(getRoute() === ROUTE_ACTIVE && 'selected')}, 'Active')),
      li(a({href: `#${ROUTE_COMPLETED}`, class: () => cs(getRoute() === ROUTE_COMPLETED && 'selected')}, 'Completed')),
    ),
    () => getCompletedCount() > 0 ? renderButton : '',
  );
};
