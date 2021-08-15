import {section, input, label, ul} from '@perform/dom-components/html';
import {diffChildrenUpdater} from '@perform/dom-components';

import {item} from './item';

export const list = ({getRouteItems, update, remove, getCheckedAll, updateAll}) => (
  section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateAll({completed: checked})?.(),
    }),
    label({for: 'toggle-all'}),
    diffChildrenUpdater(
      getRouteItems,
      ul({class: 'todo-list'}),
      getItem => item({
        getItem,
        update,
        remove,
      }),
      'id',
    ),
  )
);
