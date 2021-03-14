
// todo: memo component map, create one instance of component's prop/child updaters
// todo jsonpatch compatibility

export const memMap = (getItems, createRenderer) => {
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
