import cs from 'clsx';
import {ENTER_KEY, ESCAPE_KEY, li, div, label, input, button, identity} from './utils';

export const item = ({title, completed, setTitle: _setTitle, setCompletedR, remove}) => {
  let render, editing = false;

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
    if (! val) return remove();
    return [
      setTitle(val),
      setEditing(false)
    ].find(identity);
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
        onchange: () => setCompletedR(! completed),
      }),
      label({ondblclick: () => setEditing(true)?.()}, () => title),
      button({class: 'destroy', onclick: () => remove()?.()}),
    ),
    input({
      class: 'edit',
      value: title,
      onblur: e => handleUpdate(e)?.(),
      onkeydown: e => handleInput(e)?.(),
    }),
    () => {console.log('xixix'); return ''},
  );
};