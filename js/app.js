import {header, div, h1, input} from './html';
import {list} from './list';
import {controls} from './controls';

export const app = ({todos, getRoute, getRouteItems}) => {
  let activeCount, completedCount;

  const onkeydown = event => {
    if (event.code !== 'Enter') return;
    event.preventDefault();
    const title = event.target.value.trim();
    if (title) {
      event.target.value = '';
      todos.create({title})?.();
    }
  };

  const renderList = list({
    getRouteItems,
    getCheckedAll: () => activeCount === 0,
    update: todos.update,
    remove: todos.remove,
    updateAll: todos.updateAll,
  });

  const renderControls = controls({
    getRoute,
    getActiveCount: () => activeCount,
    getCompletedCount: () => completedCount,
    filter: todos.filter,
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

  return () => {
    const {items} = todos;

    activeCount = items.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = items.length - activeCount;

    return renderMain();
  };
};