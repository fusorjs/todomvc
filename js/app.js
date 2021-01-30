import {newTodos, header, div, h1, input} from './utils';
import {list} from './list';

export const app = ({id}) => {
  let render;

  const {addTitle, setTitle, setCompleted, remove, getLength, map} = newTodos(id);

  const onkeydown = event => {
    if (event.code !== 'Enter') return;
    event.preventDefault();
    const title = event.target.value.trim();
    if (title) {
      event.target.value = '';
      addTitle(title);
      render();
    }
  };

  const renderList = list({
    map,
    setTitle,
    setCompleted (index, completed) {
      setCompleted(index, completed);
      return render;
    },
    remove (index) {
      remove(index);
      return render;
    },
  });

  return render = div(
    header({class: 'header'},
      h1('todos'),
      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onkeydown,
        autofocus: true,
      }),
      () => getLength() ? renderList : '',
    ),
  );
};