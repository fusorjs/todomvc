
const isVoid = v => v === null || v === undefined;
const isEmpty = v => v === false || v === null || v === undefined;
const isArray = v => v.constructor === Array;
const isObject = v => v.constructor === Object;
const isFunction = v => v.constructor === Function;

/*************************************************************************************/
/* PROPS *****************************************************************************/

const createAttributeActionGetter = (textual, numeric, boolean) => (k, v, vT) => {
  switch (vT) {
    case 'string': return textual;
    case 'number': return numeric;
    case 'boolean': return boolean;
    default: throw new Error(`unsupported attribute type "${k}": ${v}`);
  }
};

const getAttributeSetterAction = createAttributeActionGetter(
  (e, k, v) => e.setAttribute(k, v),
  (e, k, v) => {
    if (v === NaN) throw new Error(`invalid attribute value "${k}": ${v}`);
    e.setAttribute(k, v);
  },
  (e, k) => e.setAttribute(k, '')
);

const getPropertyUpdaterAction = createAttributeActionGetter(
  (e, k, v) => isVoid(v) ? e.removeAttribute(k) : e.setAttribute(k, v),
  (e, k, v) => {
    if (v === NaN) throw new Error(`invalid attribute value "${k}": ${v}`);
    isVoid(v) ? e.removeAttribute(k) : e.setAttribute(k, v);
  },
  (e, k, v) => v ? e.removeAttribute(k) : e.setAttribute(k, '')
);

const updateInputProperty = (e, k, v) => e[k] = v;

const setInitialAttribute = (e, k, v) => {
  getAttributeSetterAction(k, v, typeof v)(e, k, v);
};

const getPropertyUpdater = (e, k, v, vT) => {
  if (e.tagName === 'INPUT' && (k === 'value' || k === 'checked')) {
    return updateInputProperty;
  }

  return getPropertyUpdaterAction(k, v, vT);
};

const createPropertyUpdater = (e, k, f, prev, prevT) => {
  const update = getPropertyUpdater(e, k, prev, prevT);

  return () => {
    const v = f(), vT = typeof v;

    if (vT !== prevT && prev !== undefined && v !== undefined)
      throw new Error(`mismatch attribute type "${k}": ${prev} to ${v}`);

    if (prev === v) return;
    prev = v;
    prevT = vT;

    update(e, k, v);
  };
};

const setPropsAndGetUpdaters = (e, props) => {
  let updaters;

  for (let [k, v] of Object.entries(props)) {
    if (isEmpty(v));
    else if (k.startsWith('on')) {
      if (v && isFunction(v)) e.addEventListener(k.substring(2), v, false);
      else throw new Error(`unsupported attribute "${k}": ${v}`);
    }
    else if (k === 'ref') {
      if (v && isObject(v)) v.current = e;
      else throw new Error(`unsupported attribute "${k}": ${v}`);
    }
    else {
      if (v && isFunction(v)) {
        const f = v;
        v = v();
        updaters ??= [];
        updaters.push(createPropertyUpdater(e, k, f, v, typeof v));
      }

      if (! isEmpty(v)) setInitialAttribute(e, k, v);
    }
  }

  return updaters;
};

/*************************************************************************************/
/* CHILDREN **************************************************************************/

const isDefiniteValue = v => {
  const t = typeof v;
  return t === 'string' || t === 'number';
};

const createChildUpdater = (node, f, prev) => () => {
  let v = f();

  if (v && isFunction(v)) v = v();

  if (prev === v) return;
  else prev = v;

  if (v instanceof HTMLElement);
  else if (isDefiniteValue(v)) {
    if (node instanceof Text) {
      node.nodeValue = v;
      return;
    }
    v = document.createTextNode(v);
  }
  else throw new Error(`unsupported child: ${f}`);

  node.replaceWith(v);

  node = v;
};

const createChildrenUpdater = (f, prevNodes) => e => {
  const [nextNodes] = f();

  if (nextNodes === prevNodes) return;

  const nextLength = nextNodes?.length;
  const prevLength = prevNodes?.length;

  let i = 0;

  // update
  if (nextLength && prevLength) {
    for (const minLength = Math.min(nextLength, prevLength); i < minLength; i ++) {
      const n = nextNodes[i];
      const p = prevNodes[i];

      if (n !== p)
        p.replaceWith(n);
    }
  }

  if (nextLength !== prevLength) {
    // create
    if (nextLength > prevLength) {
      for (; i < nextLength; i ++)
        e.append(nextNodes[i]);
    }
    // delete
    else if (nextLength < prevLength) {
      for (; i < prevLength; i ++)
        prevNodes[i].remove();
    }
  }

  // todo jsonpatch compatibility

  prevNodes = nextNodes;
};

const childNodesUpdaters = ([nodes, updaters], v, index, children) => {
  if (v && isFunction(v)) {
    const f = v;
    v = v();
    updaters ??= [];

    if (v instanceof HTMLElement) updaters.push(f);
    else {
      let prev = v;

      if (v && isFunction(v)) v = prev = v(); // conditions

      if (v instanceof HTMLElement);
      else if (isDefiniteValue(v)) v = document.createTextNode(v);
      else if (v && isArray(v) && children.length === 1) { // array, single child for now
        const [nodes] = v.reduce(childNodesUpdaters, []);
        return [
          nodes,
          [
            // e => {
            //   const [nodes] = f().reduce(childNodesUpdaters, []);
            //   e.replaceChildren(...nodes);
            // }
            // todo replace only diff
            createChildrenUpdater(
              () => f().reduce(childNodesUpdaters, []),
              nodes
            )
          ]
        ];
      }
      else throw new Error(`unsupported child: ${f}`);

      updaters.push(createChildUpdater(v, f, prev));
    }
  }

  nodes ??= [];
  nodes.push(v);

  return [nodes, updaters];
};

/*************************************************************************************/
/* PROPS & CHILDREN ******************************************************************/

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

/*************************************************************************************/
/* MEMO ******************************************************************************/

// todo: memo component map, create one instance of component's prop/child updaters
// todo jsonpatch compatibility

export const map = (getItems, createRenderer) => {
  let prevItems, prevRenderers, nextItems;

  // Render function:
  return () => {
    nextItems = getItems();
    // console.log(prevItems, nextItems)

    // All subsequent runs:
    if (prevItems) {
      if (nextItems === prevItems) return prevRenderers;

      const nextLength = nextItems.length;
      const prevLength = prevItems.length;

      let i = 0;

      // update
      if (nextLength && prevLength) {
        for (const minLength = Math.min(nextLength, prevLength); i < minLength; i ++)
          if (nextItems[i] !== prevItems[i])
            prevRenderers[i]();
      }

      if (nextLength !== prevLength) {
        let nextRenderers;

        // create
        if (nextLength > prevLength) {
          nextRenderers = [...prevRenderers];
          for (; i < nextLength; i ++) {
            const _i = i;
            nextRenderers.push(createRenderer(() => nextItems[_i]));
          }
        }
        // delete
        else if (nextLength < prevLength) {
          nextRenderers = prevRenderers.slice(0, nextLength);
        }

        prevRenderers = nextRenderers;
      }
    }
    // The first run:
    else {
      const nextLength = nextItems.length;

      prevRenderers = [];

      for (let i = 0; i < nextLength; i ++) {
        const _i = i;
        prevRenderers.push(createRenderer(() => nextItems[_i]));
      }
    }

    prevItems = nextItems;

    return prevRenderers;
  };
};
