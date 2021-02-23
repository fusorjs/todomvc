
const isVoid = v => v === null || v === undefined;
const isEmpty = v => v === false || v === null || v === undefined;
const isObject = v => v.constructor === Object;
const isFunction = v => v.constructor === Function;

/*************************************************************************************/
/* PROPS *****************************************************************************/

const addAttribute = (e, k, v) => {
  if (isEmpty(v)) return;

  switch (typeof v) {
    case 'string':
    case 'number':
      if (v === NaN) throw new Error(`invalid attribute value "${k}": ${v}`);
      e.setAttribute(k, v);
      break;

    case 'boolean':
      e.setAttribute(k, '');
      break;

    default:
      throw new Error(`unsupported attribute value "${k}": ${v}`);
  }
};

const createPropertyUpdater = (e, k, f, prev, prevT) => () => {
  const v = f(), vT = typeof v;

  if (vT !== prevT) throw new Error(`failed attribute update "${k}": ${prev} -> ${v}`);

  if (prev === v) return;
  else prev = v;

  switch (vT) {
    case 'string':
    case 'number':
      if (v === NaN) throw new Error(`invalid attribute value "${k}": ${v}`);
      if (isVoid(v)) e.removeAttribute(k); else e.setAttribute(k, v);
      break;

    case 'boolean':
      e[k] = v;
      break;

    default:
      throw new Error(`unsupported attribute value "${k}": ${v}`);
  }
};

const setAndCompileProps = (e, props) => {
  let _props;

  for (let [k, v] of Object.entries(props)) {
    if (k.startsWith('on')) {
      if (isEmpty(v));
      else if (v && isFunction(v)) e.addEventListener(k.substring(2), v, false);
      else throw new Error(`unsupported attribute "${k}": ${v}`);
    }
    else if (k === 'ref') {
      if (v && isObject(v)) v.current = e;
      else throw new Error(`unsupported attribute "${k}": ${v}`);
    }
    else {
      let r = v;

      if (v && isFunction(v)) {
        r = v();
        _props ??= [];
        _props.push(createPropertyUpdater(e, k, v, r, typeof r));
      }

      addAttribute(e, k, r);
    }
  }

  return _props;
};

/*************************************************************************************/
/* CHILDREN **************************************************************************/

const isDefiniteValue = r => {
  const t = typeof r;

  return t === 'string' || t === 'number';
};

const childUpdater = (node, v, prev) => () => {
  let r = v();

  if (r && isFunction(r)) r = r();

  if (prev === r) return;
  else prev = r;

  if (r instanceof HTMLElement);
  else if (isDefiniteValue(r)) {
    if (node instanceof Text) {
      node.nodeValue = r;

      return;
    }

    r = document.createTextNode(r);
  }
  else throw new Error(`child is not supported: "${v}"`);

  node.replaceWith(r);

  node = r;
};

const setAndCompileChildren = (e, children) => {
  let _children;

  for (const v of children) {
    let r = v;

    if (v && isFunction(v)) {
      _children ??= [];

      r = v();

      if (r instanceof HTMLElement) _children.push(v);
      else {
        let prev = r;

        if (r && isFunction(r)) r = prev = r();

        if (r instanceof HTMLElement);
        else if (isDefiniteValue(r)) r = document.createTextNode(r);
        else throw new Error(`child is not supported: "${v}"`);

        _children.push(childUpdater(r, v, prev));
      }
    }

    e.append(r); // todo in one go maybe
  };

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
      _props?.forEach(r => r());
      _children?.forEach(r => r());
    }

    return e;
  };
};
