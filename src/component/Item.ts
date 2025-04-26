import {getElement, update} from '@fusorjs/dom';
import {li, div, label, input, button} from '@fusorjs/dom/html';
import clsx from 'clsx';

import {
  changeDataItem,
  DataItem,
  getData,
  ID,
  removeDataItem,
  subscribeData,
} from '../share/data';

export const Item = (id: ID, item: DataItem) => {
  let editing: boolean; // entering/exiting editing mode will only trigger this component update, not the whole application, unless data was changed
  let skipBlur: boolean; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const updateTitle = (value: string) => {
    const title = value.trim();
    if (title === item.title) update(wrapper);
    else if (title) changeDataItem(id, {...item, title});
    else removeDataItem(id);
  };

  const textInput = input({
    class: 'edit',
    value: () => item.title,
    blur_e: event => {
      editing = false;
      if (skipBlur) skipBlur = false;
      else updateTitle(event.target.value);
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
          updateTitle(event.target.value);
          break;
      }
    },
  });

  const wrapper = li(
    {
      class: () => clsx(item.completed && 'completed', editing && 'editing'),
      mount: () =>
        subscribeData(() => {
          const next = getData()[id];
          if (item === next) return;
          item = next;
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
          const {completed} = item;
          changeDataItem(id, {...item, completed: !completed || undefined});
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
      button({class: 'destroy', click_e: () => removeDataItem(id)}),
    ),

    textInput, // todo load only when needed, do not pollute DOM
  );

  return wrapper;
};
