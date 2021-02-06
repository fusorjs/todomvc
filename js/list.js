import {section, input, label, ul} from './utils';
import {item} from './item';

export const list = ({mapTodos, setTodoTitle, setTodoCompleted, setTodosCompleted, removeTodo}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      onchange: ({target: {checked}}) => setTodosCompleted(checked)?.(),
    }),
    label({for: 'toggle-all'}),

    // todo array children
    () => ul({class: 'todo-list'}, ...mapTodos(({title, completed}, index) => item({
      title,
      completed,
      setTodoTitle: title => setTodoTitle(index, title),
      setTodoCompleted: completed => setTodoCompleted(index, completed),
      removeTodo: () => removeTodo(index),
    }))),
  );
};