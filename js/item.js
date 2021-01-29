import cs from 'clsx';
import {ENTER_KEY, ESCAPE_KEY, li, div, label, input, button} from './utils';

export const item = ({title, completed, setTitle, setCompletedR, removeR}) => {
  let render, editing = false;

  const setEditingR = val => {
    if (val === editing) return;
    editing = val;
    render();
  };

  // todo make usage rendering transparent

  const saveTodo = event => {
    const val = event.target.value.trim();
    if (! val) {removeR(); return;}
    if (val === title) return;
    title = val;
    setTitle(val);
    setEditingR(false);
  };

  const onkeydown = event => {
    if (event.which === ESCAPE_KEY) {
      event.target.value = title;
      setEditingR(false);
    } else if (event.which === ENTER_KEY) {
      saveTodo(event);
    } else {
      setEditingR(true);
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
      label({ondblclick: () => setEditingR(true)}, () => title),
      button({class: 'destroy', onclick: removeR}),
    ),
    input({class: 'edit', onblur: saveTodo, value: title, onkeydown}),
    () => {console.log('xixix'); return ''},
  );
};