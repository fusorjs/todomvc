
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

    if (vT !== prevT) throw new Error(`failed attribute update "${k}": ${prev} -> ${v}`);

    if (prev === v) return;
    else prev = v;

    update(e, k, v);
  };
};

const setAndCompileProps = (e, props) => {
  let _props;

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
        _props ??= [];
        _props.push(createPropertyUpdater(e, k, f, v, typeof v));
      }

      if (! isEmpty(v)) setInitialAttribute(e, k, v);
    }
  }

  return _props;
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
  else throw new Error(`child is not supported: "${f}"`);

  node.replaceWith(v);

  node = v;
};

const createArrayUpdater = () => {

};

const setAndCompileChildren = (e, children) => {
  let _children;

  e.append(...children.map(v => {
    if (v && isFunction(v)) {
      const f = v;
      v = v();
      _children ??= [];

      if (v instanceof HTMLElement) _children.push(f);
      else {
        let prev = v;

        if (v && isFunction(v)) v = prev = v();

        if (v instanceof HTMLElement);
        else if (isDefiniteValue(v)) v = document.createTextNode(v);
        // todo else if (v && isArray(v))
        else throw new Error(`unsupported child: ${f}`);

        _children.push(createChildUpdater(v, f, prev));
      }
    }

    return v;
  }));

  return _children;
};

/*************************************************************************************/
/* PROPS & CHILDREN ******************************************************************/

const getPropsAndChildren = args => {
  let props, children;

  const [first] = args;

  if (first !== undefined) {
    if (isObject(first)) {
      props = first;

      if (args[1] !== undefined) children = args.slice(1);
    }
    else children = args;
  }

  return [props, children];
};

const setAndCompilePropsAndChildren = (e, props, children) => {
  let _props, _children;

  if (props) _props = setAndCompileProps(e, props);

  if (children) _children = setAndCompileChildren(e, children);

  return [_props, _children];
};

export const h = (tag, ...args) => {
  let e, _props, _children;

  return () => {
    // 1. The first run must be in render, as it is actually renders the element!
    if (! e) {
      e = document.createElement(tag);
      [_props, _children] = setAndCompilePropsAndChildren(e, ...getPropsAndChildren(args));
    }
    // 2. All subsequent runs are just updating the rendered element.
    else {
      _props?.forEach(u => u());
      _children?.forEach(u => u());
    }

    return e;
  };
};
