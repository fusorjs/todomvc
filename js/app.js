import {ROUTE_ACTIVE, ROUTE_COMPLETED, header, div, h1, input} from './utils';
import {list} from './list';
import {controls} from './controls';

export const app = ({todos, getRoute}) => {
  let render, activeTodoCount, completedCount;

  const onkeydown = event => {
    if (event.code !== 'Enter') return;
    event.preventDefault();
    const title = event.target.value.trim();
    if (title) {
      event.target.value = '';
      todos.create({title});
      render();
    }
  };

  const renderList = list({
    getAllChecked: () => activeTodoCount === 0,
    mapAll (...a) {
      switch (getRoute()) {
        case ROUTE_ACTIVE: return todos.filter(({completed}) => ! completed).map(...a);
        case ROUTE_COMPLETED: return todos.filter(({completed}) => completed).map(...a);
        default: return todos.map(...a);
      }
    },
    updateTitle: (id, title) => todos.update(id, {title}),
    updateCompleted (id, completed) {
      todos.update(id, {completed});
      return render;
    },
    setAllCompleted (completed) {
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
    removeAllCompleted () {
      todos.removeAllCompleted();
      return render;
    },
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
      () => activeTodoCount || completedCount ? renderControls : '',
    ),
  );

  return render = () => {
    activeTodoCount = todos.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = todos.getLength() - activeTodoCount;

    return renderMain();
  };
};