import {li, div, label, input, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {Model} from './model';

interface Props {
  getItem: () => Todo;
  todos: Model;
}

export const TodoItem = ({getItem, todos}: Props) => {
  let editing: boolean;
  let skipBlur: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const handleUpdate = ({target}: Target<HTMLInputElement>) => {
    const title = target.value.trim();

    if (title) todos.updateTitle(getItem().id, title);
    else todos.remove(getItem().id);
  };

  const textInput = input({
    class: 'edit',
    value$$: () => getItem().title, // Value is not updating because the attribute is shown in inspector, but the property is updating fine!
    onblur: e => {
      editing = false;

      if (skipBlur) skipBlur = false;
      else handleUpdate(e);
    },
    onkeydown: event => {
      switch (event.code) {
        case 'Escape':
          editing = false;
          skipBlur = true;
          wrapper.update();
          break;
        case 'Enter':
          editing = false;
          skipBlur = true;
          handleUpdate(event);
          break;
      }
    },
  });

  const wrapper = li(
    {
      class: () =>
        clsx(getItem().completed && 'completed', editing && 'editing'),
    },

    div(
      {class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked$$: () => getItem().completed,
        onchange: () => {
          const {id, completed} = getItem();
          todos.updateCompleted(id, !completed);
        },
      }),
      label(
        {
          ondblclick: () => {
            editing = true;
            wrapper.update();
            textInput.element.select(); // after wrapper update
          },
        },
        () => getItem().title,
      ),
      button({class: 'destroy', onclick: () => todos.remove(getItem().id)}),
    ),

    textInput,
  );

  return wrapper;
};
