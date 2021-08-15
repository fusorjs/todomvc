import {li, div, label, input, button} from '@perform/dom-components/html';
import cs from 'clsx';

export const item = ({getItem, update, remove}) => {
  let render, editing;
  let removed; // https://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node

  const inputRef = {};

  const setEditing = val => {
    if (val === editing) return;
    editing = val;
    return render;
  };

  const handleUpdate = ({target}) => {
    const title = target.value.trim();
    if (! title) {removed = true; return remove(getItem().id);}
    target.value = title;
    const t = update(getItem().id, {title});
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

  return render = li({
    class: () => cs(getItem().completed && 'completed', editing && 'editing'),
  },
    div({class: 'view'},
      input({
        class: 'toggle',
        type: 'checkbox',
        checked: () => getItem().completed,
        onchange: () => {
          const {id, completed} = getItem();
          update(id, {completed: ! completed})?.() // todo make straight render
        },
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
      value: () => getItem().title, // Value is not updating because the attribute is shown in inspector, but the property is updating fine!
      ref: inputRef,
      onblur: e => removed || handleUpdate(e)?.(),
      onkeydown: e => handleInput(e)?.(),
    }),
  );
};
