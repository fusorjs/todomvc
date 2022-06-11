import {header, div, h1, input} from '@efusor/dom/html';

import {TodoList} from './list';
import {FooterControls} from './controls';

export const App = ({todos, getRoute, getRouteItems}) => {
  let activeCount, completedCount;

  const calcCounts = () => {
    const {items} = todos;

    activeCount = items.reduce(
      (acc, {completed}) => completed ? acc : acc + 1,
      0
    );

    completedCount = items.length - activeCount;
  };

  calcCounts();

  const onkeydown = event => {
    if (event.code !== 'Enter') return;
    event.preventDefault();
    const title = event.target.value.trim();
    if (title) {
      event.target.value = '';
      todos.create({title});
    }
  };

  const todoList = TodoList({
    getRouteItems,
    getCheckedAll: () => activeCount === 0,
    update: todos.update,
    remove: todos.remove,
    updateAll: todos.updateAll,
  });

  const mainControls = FooterControls({
    getRoute,
    getActiveCount: () => activeCount,
    getCompletedCount: () => completedCount,
    filter: todos.filter,
  });

  const wrapper = div(
    header({class: 'header'}, // todo header contains all content
      h1('todos'),
      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onkeydown,
        autofocus: true,
      }),
      () => todos.items.length ? todoList : '',
      () => activeCount || completedCount ? mainControls : '',
    ),
  );

  return {
    update: () => {
      calcCounts();
      wrapper.update();
    },
    get element () {
      return wrapper.element;
    }
  };
};