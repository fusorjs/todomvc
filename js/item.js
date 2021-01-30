import cs from 'clsx';
import {ENTER_KEY, ESCAPE_KEY, li, div, label, input, button} from './utils';

export const item = ({title, completed, setTitle: _setTitle, setCompleted, remove}) => {
  let render, removed, editing = false;

  const setEditing = val => {
    if (val === editing) return;
    editing = val;
    return render;
  };

  const setTitle = val => {
    if (val === title) return;
    title = val;
    return _setTitle(val) || render;
  };

  const handleUpdate = event => {
    const val = event.target.value.trim();
    if (! val) {removed = true; return remove();}
    const t = setTitle(val);
    const e = setEditing(false);
    return t || e;
  };

  const handleInput = event => {
    switch (event.which) {
      case ESCAPE_KEY:
        event.target.value = title;
        return setEditing(false);
      case ENTER_KEY:
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
        onchange: () => setCompleted(! completed)?.(),
      }),
      label({ondblclick: () => setEditing(true)?.()}, () => title),
      button({class: 'destroy', onclick: () => remove()?.()}),
    ),
    input({
      class: 'edit',
      value: title,
      onblur: e => removed || handleUpdate(e)?.(),
      onkeydown: e => handleInput(e)?.(),
    }),
    // () => {console.log('xixix'); return ''},
  );
};