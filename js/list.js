import {memoComponents, memoComponents2} from '../perform/perform';
import {section, input, label, ul} from '../perform/tags';

import {item} from './item';

export const list = ({
  getVisible, updateTitle, updateCompleted, remove, getCheckedAll, updateAllCompleted,
}) => {
  let render;

  return render = section({class: 'main'},
    input({
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: getCheckedAll,
      onchange: ({target: {checked}}) => updateAllCompleted(checked)?.(),
    }),
    label({for: 'toggle-all'}),

    // 3 ways of doing dynamic children:
    // () => ul({class: 'todo-list'}, ...getVisible().map(({id, title, completed}) => item({
    // ul({class: 'todo-list'}, () => getVisible().map(({id, title, completed}) => item({
    ul({class: 'todo-list'}, memoComponents(getVisible, ({id, title, completed}) => item({
      id,
      title,
      completed,
      updateTitle,
      updateCompleted,
      remove,
    }))),

    // ul({class: 'todo-list'}, memoComponents2(getVisible, getItem => item({
    //   id: () => getItem().id,
    //   title: () => getItem().title,
    //   completed: () => getItem().completed,
    //   updateTitle,
    //   updateCompleted,
    //   remove,
    // }))),
  );
};