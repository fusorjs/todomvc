import cs from 'clsx';

import {li, div, label, input, button} from '../perform/html';

export const item2 = ({getItem, updateTitle, updateCompleted, remove}) => {
  let render, editing;
  const inputRef = {};

  let removed; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const setEditing = val => {
    if (val === editing) return;
    editing = val;
    return render;
  };

  const setTitle = val => {
    if (val === getItem().title) return;
    return updateTitle(getItem().id, val) || render;
  };

  const handleUpdate = event => {
    const val = event.target.value.trim();
    if (! val) {removed = true; return remove(getItem().id);}
    const t = setTitle(val);
    const e = setEditing(false);
    return t || e;
  };

  const handleInput = event => {
    switch (event.code) {
      case 'Escape':
        event.target.value = getItem().title;
        return setEditing(false);
      case 'Enter':
        return handleUpdate(event);
      default:
        return setEditing(true);
    }
  };

  return render = li({class: () => cs(getItem().completed && 'completed', editing && 'editing')},
    div({class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked: () => getItem().completed,
        onchange: () => updateCompleted(getItem().id, ! getItem().completed)?.(),
      }),
      label({
        ondblclick: () => {
          setEditing(true)?.();
          inputRef.current.select();
        },
      }, () => getItem().title),
      button({class: 'destroy', onclick: () => remove(getItem().id)?.()}),
    ),
    input({
      class: 'edit',
      value: () => getItem().title,
      ref: inputRef,
      onblur: e => removed || handleUpdate(e)?.(),
      onkeydown: e => handleInput(e)?.(),
    }),
  );
};