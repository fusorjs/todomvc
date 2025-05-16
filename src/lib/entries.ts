export function* entries<K extends string | number | symbol, V>(
  obj: Record<K, V>,
) {
  for (const key in obj) yield [key, obj[key]] as [K, V];
}

// for (const x of entries({aaa: 111, bbb: 222})) console.log(x);
