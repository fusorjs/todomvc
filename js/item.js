import {li, div, label, input, button} from '@efusor/dom/html';
import clsx from 'clsx';

export const TodoItem = ({todo, update, remove}) => {
  let wrapper, editing;
  let removed; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node
  let inputRef;

  const handleUpdate = ({target}) => {
    const title = target.value.trim();

    if (title) {
      editing = false;
      target.value = title;
      update(todo.id, {title});
    } else {
      removed = true;
      remove(todo.id);
    }
  };

  return wrapper = li({
    class: () => clsx(todo.completed && 'completed', editing && 'editing'),
  },
    div({class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked$$: () => todo.completed,
        onchange: () => {
          const {id, completed} = todo;
          update(id, {completed: ! completed});
        },
      }),
      label({
        ondblclick: () => {
          editing = true;
          wrapper.update();
          inputRef.element.select(); // after update
        },
      }, () => todo.title),
      button({class: 'destroy', onclick: () => remove(todo.id)}),
    ),

    inputRef = input({
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
    }),
  );
};
