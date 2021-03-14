import {map} from '../perform/perform';
import {section, input, label, ul} from '../perform/tags';

import {item} from './item';
import {item1} from './item1';

export const list = ({
  getVisible, updateTitle, updateCompleted, remove, getCheckedAll, updateAllCompleted,
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

    // () => ul({class: 'todo-list'}, ...getVisible().map(({id, title, completed}) => item1({
    ul({class: 'todo-list'}, () => getVisible().map(({id, title, completed}) => item1({
      id,
      title,
      completed,
      updateTitle,
      updateCompleted,
      remove,
    }))),

    // ul({class: 'todo-list'}, map(getVisible, getItem => item({
    //   id: getItem().id,
    //   title: getItem().title,
    //   getCompleted: () => getItem().completed,
    //   updateTitle,
    //   updateCompleted,
    //   remove,
    // }))),
  );
};