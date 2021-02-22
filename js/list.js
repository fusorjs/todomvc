import {section, input, label, ul} from './utils';
import {item} from './item';

export const list = ({
  mapAll, updateTitle, updateCompleted, setAllCompleted, removeTodo, getAllChecked,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getAllChecked, // todo toggle then toggle individual, will not update???
      onchange: ({target: {checked}}) => setAllCompleted(checked)?.(),
    }),
    label({for: 'toggle-all'}),

    // todo array children
    () => ul({class: 'todo-list'}, ...mapAll(({id, title, completed}, index) => item({
      id,
      title,
      completed,
      updateTitle,
      updateCompleted,
      removeTodo: () => removeTodo(index),
    }))),
  );
};