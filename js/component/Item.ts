import {li, div, label, input, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {
  DataItem,
  removeDataItem,
  setDataItemCompleted,
  setDataItemTitle,
} from '../data';

interface Props {
  getValue: () => DataItem;
}

export const Item = ({getValue}: Props) => {
  let editing: boolean; // entering/exiting editing mode will only trigger this component update, not the whole application, unless data was changed
  let skipBlur: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const handleTitle = ({target}: Target<HTMLInputElement>) => {
    const newTitle = target.value.trim();
    const {id, title} = getValue();

    if (newTitle) {
      if (newTitle === title) wrapper.update();
      else setDataItemTitle(id, newTitle);
    } else {
      removeDataItem(id);
    }
  };

  const textInput = input({
    class: 'edit',
    value$p: () => getValue().title, // Value is not updating because the attribute is shown in inspector, but the property is updating fine!
    blur$e: e => {
      editing = false;

      if (skipBlur) skipBlur = false;
      else handleTitle(e);
    },
    keydown$e: event => {
      switch (event.code) {
        case 'Escape':
          textInput.element.value = getValue().title; // the value is not updated for some reason (maybe display:none)
          editing = false;
          skipBlur = true;
          wrapper.update();
          break;
        case 'Enter':
          editing = false;
          skipBlur = true;
          handleTitle(event);
          break;
      }
    },
  });

  const wrapper = li(
    {
      class: () =>
        clsx(getValue().completed && 'completed', editing && 'editing'),
    },

    div(
      {class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked: () => getValue().completed,
        change$e: () => {
          const {id, completed} = getValue();

          setDataItemCompleted(id, !completed);
        },
      }),
      label(
        {
          dblclick$e: () => {
            editing = true;
            wrapper.update();
            textInput.element.select(); // after wrapper update
          },
        },
        () => getValue().title,
      ),
      button({class: 'destroy', click$e: () => removeDataItem(getValue().id)}),
    ),

    textInput,
  );

  return wrapper;
};
