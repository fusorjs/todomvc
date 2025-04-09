import {getElement, update} from '@fusorjs/dom';
import {li, div, label, input, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {
  DataItem,
  removeDataItem,
  setDataItemCompleted,
  setDataItemTitle,
  subscribeItem,
} from '../share/data';

export const Item = (item: DataItem) => {
  let editing: boolean; // entering/exiting editing mode will only trigger this component update, not the whole application, unless data was changed
  let skipBlur: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const handleTitle = (value: string) => {
    const newTitle = value.trim();
    const {id, title} = item;

    if (newTitle) {
      if (newTitle === title) update(wrapper);
      else setDataItemTitle(id, newTitle);
    } else {
      removeDataItem(id);
    }
  };

  const textInput = input({
    class: 'edit',
    value: () => item.title,
    blur_e: event => {
      editing = false;

      if (skipBlur) skipBlur = false;
      else handleTitle(event.target.value);
    },
    keydown_e: event => {
      switch ((event as any as KeyboardEvent).code) {
        case 'Escape':
          getElement(textInput).value = item.title;
          editing = false;
          skipBlur = true;
          update(wrapper);
          break;
        case 'Enter':
          editing = false;
          skipBlur = true;
          handleTitle(event.target.value);
          break;
      }
    },
  });

  const wrapper = li(
    {
      class: () => clsx(item.completed && 'completed', editing && 'editing'),
      mount: () =>
        subscribeItem(change => {
          if (change.id !== item.id) return;
          item = change;
          update(wrapper);
        }),
    },

    div(
      {class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked: () => item.completed,
        change_e: () => {
          const {id, completed} = item;

          setDataItemCompleted(id, !completed);
        },
      }),
      label(
        {
          dblclick_e: () => {
            editing = true;
            update(wrapper);
            getElement(textInput).select(); // ! after wrapper update
          },
        },
        () => item.title,
      ),
      button({class: 'destroy', click_e: () => removeDataItem(item.id)}),
    ),

    textInput,
  );

  return wrapper;
};
