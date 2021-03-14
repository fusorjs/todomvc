import {memMap} from '../perform/memMap';
import {section, input, label, ul} from '../perform/html';

import {item} from './item';
import {item1} from './item1';
import {item2} from './item2';

export const list = ({
  getRouteItems, updateTitle, updateCompleted, remove, getCheckedAll, updateAllCompleted,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateAllCompleted(checked)?.(),
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

    // ul({class: 'todo-list'}, memMap(getRouteItems, getItem => item({
    //   id: getItem().id,
    //   title: getItem().title,
    //   getCompleted: () => getItem().completed,
    //   updateTitle,
    //   updateCompleted,
    //   remove,
    // }))),

    ul({class: 'todo-list'}, memMap(getRouteItems, getItem => item2({
      getItem,
      updateTitle,
      updateCompleted,
      remove,
    }))),
  );
};