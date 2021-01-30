import {header, div, h1, input} from './utils';
import {list} from './list';

export const app = ({todos}) => {
  let render;

  const onkeydown = event => {
    if (event.code !== 'Enter') return;
    event.preventDefault();
    const title = event.target.value.trim();
    if (title) {
      event.target.value = '';
      todos.add({title});
      render();
    }
  };

  const renderList = list({
    mapTodos: todos.map,
    setTodoTitle: todos.setTitle,
    setTodoCompleted (index, completed) {
      todos.setCompleted(index, completed);
      return render;
    },
    removeTodo (index) {
      todos.remove(index);
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
      () => todos.getLength() ? renderList : '',
    ),
  );
};