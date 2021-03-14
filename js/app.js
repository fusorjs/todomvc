import {header, div, h1, input} from '../perform/html';
import {memF} from '../perform/memF';

import {getRouteItems, isNotCompleted} from './utils';
import {list} from './list';
import {controls} from './controls';

export const app = ({todos, getRoute}) => {
  let activeCount, completedCount;

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

  const getRouteItemsMem = memF(getRouteItems);

  const renderList = list({
    getCheckedAll: () => activeCount === 0,
    getRouteItems: () => getRouteItemsMem(getRoute(), todos.items),
    updateTitle (id, title) {
      todos.update(id, {title});
      return render;
    },
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
      todos.filter(isNotCompleted);
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

  function render () {
    const {items} = todos;

    activeCount = items.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = items.length - activeCount;

    return renderMain();
  };

  return render;
};