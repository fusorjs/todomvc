type ID = string;

interface Todo {
  id: ID;
  title: string;
  completed: boolean;
}

interface Target<T extends Element> {
  target: T;
}
