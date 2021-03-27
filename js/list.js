import {memMap} from '@perform/core/helpers';

import {section, input, label, ul} from './html';
import {item1} from './item1';
import {item2} from './item2';
import {item} from './item';

export const list = ({
  getRouteItems, update, remove, getCheckedAll, updateAll,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateAll({completed: checked})?.(),
    }),
    label({for: 'toggle-all'}),

    // () => ul({class: 'todo-list'}, ...getRouteItems().map(({id, title, completed}) => item1({
    // ul({class: 'todo-list'}, () => getRouteItems().map(({id, title, completed}) => item1({
    //   id,
    //   title,
    //   completed,
    //   updateTitle,
    //   updateCompleted,
    //   remove,
    // }))),

    // ul({class: 'todo-list'}, memMap(getRouteItems, getItem => item2({
    //   id: getItem().id,
    //   title: getItem().title,
    //   getCompleted: () => getItem().completed,
    //   updateTitle,
    //   updateCompleted,
    //   remove,
    // }))),

    ul({class: 'todo-list'}, memMap(getRouteItems, getItem => item({
      getItem,
      update,
      remove,
    }), 'id')),
  );
};