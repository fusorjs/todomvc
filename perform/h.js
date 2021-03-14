
import {isObject, childNodesUpdaters, setPropsAndGetUpdaters} from './perform';

const getPropsAndChildren = args => {
  let props, children;

  const [first] = args;

  if (first !== undefined) {
    if (isObject(first)) {
      props = first;

      if (args[1] !== undefined)
        children = args.slice(1); // todo avoid new array creation
    }
    else children = args;
  }

  return [props, children];
};

const setAndCompilePropsAndChildren = (e, props, children) => {
  let propUpdaters, childNodes, childUpdaters;

  if (props) propUpdaters = setPropsAndGetUpdaters(e, props);

  if (children) {
    [childNodes, childUpdaters] = children.reduce(childNodesUpdaters, []);
    if (childNodes) e.append(...childNodes);
  }

  return [propUpdaters, childUpdaters];
};

export const h = (tag, ...args) => {
  let e, propUpdaters, childUpdaters;

  // Render function:
  return () => {
    // All subsequent runs are just updating the rendered element:
    if (e) {
      propUpdaters?.forEach(u => u());
      childUpdaters?.forEach(u => u(e));
    }
    // The first run must be in render, as it is actually renders the element:
    else {
      e = document.createElement(tag);
      [propUpdaters, childUpdaters] = setAndCompilePropsAndChildren(e, ...getPropsAndChildren(args));
    }

    return e;
  };
};
