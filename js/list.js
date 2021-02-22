import {section, input, label, ul} from './utils';
import {item} from './item';

export const list = ({
  mapAll, updateTitle, updateCompleted, remove, getCheckedAll, updateCompletedAll,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll, // todo toggle then toggle individual, will not update???
      onchange: ({target: {checked}}) => updateCompletedAll(checked)?.(),
    }),
    label({for: 'toggle-all'}),

    // todo array children
    () => ul({class: 'todo-list'}, ...mapAll(({id, title, completed}) => item({
      id,
      title,
      completed,
      updateTitle,
      updateCompleted,
      remove,
    }))),
  );
};