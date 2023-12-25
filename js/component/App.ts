import {Component} from '@fusorjs/dom';
import {header, section, h1, input} from '@fusorjs/dom/html';

import {ValueObserver} from '../lib/valueObserver';
import {publish} from '../lib/publishSubscribe';

import {Route, routeId} from '../share';
import {addDataItem, getAllData} from '../data';

import {List} from './List';
import {Panel} from './Panel';

export const App = () => {
  const routeObserver = new ValueObserver<Route>();
  const reroute = () => {
    let route = location.hash.substring(1) as Route;
    // sanitize route
    switch (route) {
      case '/':
      case '/active':
      case '/completed':
        break;
      default:
        route = '/';
    }
    routeObserver.setValue(route);
    console.log('reroute');
  };

  const list = LazyCached(() => List());
  const panel = LazyCached(() => Panel());

  return section(
    {
      class: 'todoapp',
      mount: () => {
        window.addEventListener('popstate', reroute, false);
        setTimeout(reroute);
        return () => {
          window.removeEventListener('popstate', reroute, false);
        };
      },
    },
    publish(routeId, routeObserver),

    header(
      {class: 'header'},
      h1('todos'),

      input({
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        autofocus: true,

        keydown$e: (event: KeyboardEvent & Target<HTMLInputElement>) => {
          if (event.code !== 'Enter') return;

          event.preventDefault();

          const title = event.target.value.trim();

          if (title) {
            event.target.value = '';
            addDataItem({
              title,
              completed: false,
            });
          }
        },
      }),
    ),

    () => getAllData().length > 0 && list(),
    () => getAllData().length > 0 && panel(),
  );
};

/** Prevent first update */
const LazyCached = <T extends Element>(lazy: () => Component<T>) => {
  let cache: undefined | Component<T>;

  return () => cache?.update() ?? (cache = lazy());
};
