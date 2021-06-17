import {diffChildren} from '@perform/core/dom/children/update/diff';

import {section, input, label, ul} from './html';
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
    ul({class: 'todo-list'}, diffChildren(getRouteItems, getItem => item({
      getItem,
      update,
      remove,
    }), 'id')),
    // }))),
  )
);
