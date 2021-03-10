import {memoMap} from '../perform/perform';
import {section, input, label, ul} from '../perform/tags';

import {item} from './item';

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

    // todo array children
    // () => ul({class: 'todo-list'}, ...mapVisible(({id, title, completed}) => item({
    // ul({class: 'todo-list'}, () => mapVisible(({id, title, completed}) => item({
    ul({class: 'todo-list'}, memoMap(getVisible, ({id, title, completed}) => item({
      id,
      title,
      completed,
      updateTitle,
      updateCompleted,
      remove,
    }))),
  );
};