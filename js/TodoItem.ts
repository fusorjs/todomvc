import {li, div, label, input, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {Model} from './model';

interface Props {
  todo: Todo;
  todos: Model;
}

export const TodoItem = ({todo, todos}: Props) => {
  let editing: boolean;
  let removed: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const handleUpdate = ({target}: Target<HTMLInputElement>) => {
    const title = target.value.trim();

    if (title) {
      editing = false;
      target.value = title;
      todos.updateTitle(todo.id, title);
    } else {
      removed = true;
      todos.remove(todo.id);
    }
  };

  const textInput = input({
    class: 'edit',
    value$$: () => todo.title, // Value is not updating because the attribute is shown in inspector, but the property is updating fine!
    onblur: e => {
      removed || handleUpdate(e);
      wrapper.update();
    },
    onkeydown: event => {
      switch (event.code) {
        case 'Escape':
          event.target.value = todo.title;
          editing = false;
          break;
        case 'Enter':
          handleUpdate(event);
          break;
        default:
          editing = true;
          break;
      }
      wrapper.update();
    },
  });

  const wrapper = li(
    {
      class: () => clsx(todo.completed && 'completed', editing && 'editing'),
    },

    div(
      {class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked$$: () => todo.completed,
        onchange: () => {
          const {id, completed} = todo;
          todos.updateCompleted(id, !completed);
        },
      }),
      label(
        {
          ondblclick: () => {
            editing = true;
            wrapper.update();
            textInput.element.select(); // after update
          },
        },
        () => todo.title,
      ),
      button({class: 'destroy', onclick: () => todos.remove(todo.id)}),
    ),

    textInput,
  );

  return wrapper;
};
