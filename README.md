# Todomvc

**[Demo Application Website](https://fusorjs.github.io/todomvc/)**

Todomvc is a simple todo-list application and an implementation of the [TodoMVC specification](http://todomvc.com/) using the [Fusor DOM library](https://github.com/fusorjs/dom#readme).

This is not the simplest solution. It is designed to be efficient and update DOM only when necessary. Therefore it adds these techniques:

- immutable data/array manipulation
- component caching and memoization

## Todo

- continue developing more optimisation techniques in `List.ts`
- combine in array `[list, panel]` in `App.ts` when it will be supported by the `@fusorjs/dom`
- simplify routing
- simplify data
- add shared folder and webpack aliases

## Done

- update to @fusorjs version 2
- @efusor to @fusorjs
- total refactor, simplify, use modules
- migrate to typescript
