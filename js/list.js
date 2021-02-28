import {memoMap} from './perform';
import {section, input, label, ul} from './utils';
import {item} from './item';

export const list = ({
  getVisible, updateTitle, updateCompleted, remove, getCheckedAll, updateCompletedAll,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateCompletedAll(checked)?.(),
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