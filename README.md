# Todomvc

**[Demo Application Website](https://fusorjs.github.io/todomvc/)**

Todomvc is a simple todo-list application and an implementation of the [TodoMVC specification](http://todomvc.com/) using the [Fusor DOM library](https://github.com/fusorjs/dom).

This is not the simplest solution. It is designed to showcase the proper approach for large-scale application development. It has these features:

- Routing
- Immutable data store
- Component caching and memoization
- The DOM is updated only where/when necessary

## Start

```sh
npm install
npm start
```

## Todo

<!-- - Cypress E2E performance? -->

- refactor global state, maybe https://immerjs.github.io/immer/
- continue developing more optimisation/diffing techniques in `List.ts`
- add shared folder and webpack aliases
- simplify editing
- remove clsx

## Done

- simplify data
- simplify routing
- combine in array `[list, panel]` in `App.ts` when it will be supported
- update to @fusorjs version 2
- @efusor to @fusorjs
- total refactor, simplify, use modules
- migrate to typescript
