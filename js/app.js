import {
  ROUTE_ALL, ROUTE_ACTIVE, ROUTE_COMPLETED,
  header, div, h1, input
} from './utils';
import {list} from './list';
import {controls} from './controls';

export const app = ({todos, getRoute}) => {
  let render, shownTodos, activeTodoCount, completedCount;

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
    mapTodos: (...a) => shownTodos.map(...a),
    setTodoTitle: todos.setTitle,
    setTodoCompleted (index, completed) {
      todos.setCompleted(index, completed);
      return render;
    },
    setTodosCompleted (completed) {
      todos.setAllCompleted(completed);
      return render;
    },
    removeTodo (index) {
      todos.remove(index);
      return render;
    },
  });

  const renderControls = controls({
    getRoute,
    getActiveCount: () => activeTodoCount,
    getCompletedCount: () => completedCount,
    //, clearCompleted
  });

  const renderMain = div(
    header({class: 'header'},
      h1('todos'),
      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onkeydown,
        autofocus: true,
      }),
      () => todos.getLength() ? renderList : '',
      renderControls,
    ),
  );

  return render = () => {
    shownTodos = todos.filter(({completed}) => {
      switch (getRoute()) {
        case ROUTE_ACTIVE: return ! completed;
        case ROUTE_COMPLETED: return completed;
        default: return true;
      }
    });

    activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    completedCount = todos.getLength() - activeTodoCount;

    return renderMain();
  };
};