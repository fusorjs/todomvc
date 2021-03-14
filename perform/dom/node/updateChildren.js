
export const updateChildren = (e, prevNodes, nextNodes) => {
  const nextLength = nextNodes?.length ?? 0;
  const prevLength = prevNodes?.length ?? 0;

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
};
