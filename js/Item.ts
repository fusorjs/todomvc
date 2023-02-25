import {li, div, label, input, button} from '@efusor/dom/html';
import clsx from 'clsx';

import {
  DataItem,
  removeDataItem,
  setDataItemCompleted,
  setDataItemTitle,
} from './data';

interface Props {
  getValue: () => DataItem;
}

export const Item = ({getValue}: Props) => {
  let editing: boolean;
  let skipBlur: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const handleUpdate = ({target}: Target<HTMLInputElement>) => {
    const title = target.value.trim();

    if (title) setDataItemTitle(getValue().id, title);
    else removeDataItem(getValue().id);
  };

  const textInput = input({
    class: 'edit',
    value$$: () => getValue().title, // Value is not updating because the attribute is shown in inspector, but the property is updating fine!
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
        clsx(getValue().completed && 'completed', editing && 'editing'),
    },

    div(
      {class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked$$: () => getValue().completed,
        onchange: () => {
          const {id, completed} = getValue();

          setDataItemCompleted(id, !completed);
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
        () => getValue().title,
      ),
      button({class: 'destroy', onclick: () => removeDataItem(getValue().id)}),
    ),

    textInput,
  );

  return wrapper;
};
