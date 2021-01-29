
const isEmpty = v => v === false ||  v === null || v === undefined;
const isFunction = v => v?.constructor === Function;

/*************************************************************************************/
/* PROPS *****************************************************************************/

const setAttribute = (e, k, v) => {
  if (isEmpty(v)) {
    e.removeAttribute(k);
    return;
  }

  if (v === NaN) throw new Error(`attribute is not supported: ${k} = NaN`);

  switch (typeof v) {
    case 'string':
    case 'number':
      e.setAttribute(k, v);
      break;

    case 'boolean':
      e.setAttribute(k, '');
      break;

    default:
      throw new Error(`attribute type is not supported: "${k}": ${typeof v}`);
  }
};

const newAttributeSetter = (e, k, v, prev) => () => {
  const r = v();

  if (prev === r) return;
  else prev = r;

  setAttribute(e, k, r);
};

const setAndCompileProps = (e, props) => {
  let _props;

  for (let [k, v] of Object.entries(props)) {
    if (k.startsWith('on')) {
      if (isEmpty(v));
      else if (isFunction(v)) e.addEventListener(k.substring(2), v, false);
      else throw new Error(`attribute is not supported: ${k} = ${v}`);
    }
    else {
      let r = v;

      if (isFunction(v)) {
        r = v();
        _props ??= [];
        _props.push(newAttributeSetter(e, k, v, r));
      }

      setAttribute(e, k, r);
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

  if (isFunction(r)) r = r();

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

    if (isFunction(v)) {
      _children ??= [];

      r = v();

      if (r instanceof HTMLElement) _children.push(v);
      else {
        let prev = r;

        if (isFunction(r)) r = prev = r();

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
    if (first.constructor === Object) {
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
