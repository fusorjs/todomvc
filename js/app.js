import {
  ROUTE_ACTIVE, ROUTE_COMPLETED,
  header, div, h1, input,
  memoize,
} from './utils';
import {list} from './list';
import {controls} from './controls';

export const app = ({todos, getRoute}) => {
  let render, activeCount, completedCount;

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

  const getVisible = memoize((items, route) => {
    switch (route) {
      case ROUTE_ACTIVE: return items.filter(({completed}) => ! completed);
      case ROUTE_COMPLETED: return items.filter(({completed}) => completed);
      default: return items;
    }
  });

  const renderList = list({
    getCheckedAll: () => activeCount === 0,
    getVisible: () => getVisible(todos.items, getRoute()),
    updateTitle: (id, title) => todos.update(id, {title}),
    updateCompleted (id, completed) {
      todos.update(id, {completed});
      return render;
    },
    remove (id) {
      todos.remove(id);
      return render;
    },
    updateAllCompleted (completed) {
      todos.updateAll({completed});
      return render;
    },
  });

  const renderControls = controls({
    getRoute,
    getActiveCount: () => activeCount,
    getCompletedCount: () => completedCount,
    removeAllCompleted () {
      todos.filter(({completed}) => ! completed);
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
      () => activeCount || completedCount ? renderControls : '',
    ),
  );

  return render = () => {
    const {items} = todos;

    activeCount = items.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = items.length - activeCount;

    return renderMain();
  };
};