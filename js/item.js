import cs from 'clsx';
import {li, div, label, input, button} from './utils';

export const item = ({id, title, completed, updateTitle, updateCompleted, remove}) => {
  let render, editing;
  const inputRef = {};

  let removed; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const setEditing = val => {
    if (val === editing) return;
    editing = val;
    return render;
  };

  const setTitle = val => {
    if (val === title) return;
    title = val;
    return updateTitle(id, val) || render;
  };

  const handleUpdate = event => {
    const val = event.target.value.trim();
    if (! val) {removed = true; return remove(id);}
    const t = setTitle(val);
    const e = setEditing(false);
    return t || e;
  };

  const handleInput = event => {
    switch (event.code) {
      case 'Escape':
        event.target.value = title;
        return setEditing(false);
      case 'Enter':
        return handleUpdate(event);
      default:
        return setEditing(true);
    }
  };

  return render = li({class: () => cs(completed && 'completed', editing && 'editing')},
    div({class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked: completed,
        onchange: () => updateCompleted(id, ! completed)?.(),
      }),
      label({
        ondblclick: () => {
          setEditing(true)?.();
          inputRef.current.select();
        },
      }, () => title),
      button({class: 'destroy', onclick: () => remove(id)?.()}),
    ),
    input({
      class: 'edit',
      value: title,
      ref: inputRef,
      onblur: e => removed || handleUpdate(e)?.(),
      onkeydown: e => handleInput(e)?.(),
    }),
  );
};