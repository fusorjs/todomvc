
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
      if (prevItems === nextItems) return prevRenderers;

      const prevLength = prevItems.length;
      const nextLength = nextItems.length;

      let i = 0;

      // update
      if (prevLength && nextLength) {
        for (const minLength = Math.min(prevLength, nextLength); i < minLength; i ++)
          if (prevItems[i] !== nextItems[i])
            prevRenderers[i]();
      }

      if (prevLength !== nextLength) {
        let nextRenderers;

        // create
        if (prevLength < nextLength) {
          nextRenderers = [...prevRenderers];
          for (; i < nextLength; i ++) {
            const _i = i;
            nextRenderers.push(createRenderer(() => nextItems[_i]));
          }
        }
        // delete
        else if (prevLength > nextLength) {
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
