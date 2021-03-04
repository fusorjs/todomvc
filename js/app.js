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
    getCheckedAll: () => activeTodoCount === 0,
    getVisible () {
      const {items} = todos;
      switch (getRoute()) {
        case ROUTE_ACTIVE: return items.filter(({completed}) => ! completed);
        case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
        default: return items;
      }
    },
    updateTitle: (id, title) => todos.update(id, {title}),
    updateCompleted (id, completed) {
      todos.update(id, {completed});
      return render;
    },
    remove (id) {
      todos.remove(id);
      return render;
    },
    updateCompletedAll (completed) {
      todos.updateCompletedAll(completed);
      return render;
    },
  });

  const renderControls = controls({
    getRoute,
    getActiveCount: () => activeTodoCount,
    getCompletedCount: () => completedCount,
    removeCompletedAll () {
      todos.removeCompletedAll();
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
      () => todos.items.length ? renderList : '',
      () => activeTodoCount || completedCount ? renderControls : '',
    ),
  );

  return render = () => {
    const {items} = todos;

    activeTodoCount = items.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = items.length - activeTodoCount;

    return renderMain();
  };
};