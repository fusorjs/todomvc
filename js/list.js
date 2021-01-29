import {section, input, label, ul} from './utils';
import {item} from './item';

export const list = ({map, setTitle, setCompleted, remove}) => {
  let render;

  const handleToggleAll = () => {};

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      onchange: handleToggleAll,
      // todo
    }),
    label({for: 'toggle-all'}),

    // todo array children
    () => ul({class: 'todo-list'}, ...map(({title, completed}, index) => item({
      title,
      completed,
      setTitle: title => setTitle(index, title),
      setCompleted: completed => setCompleted(index, completed),
      remove: () => remove(index),
      onToggle: () => {},
    }))),

  );
};