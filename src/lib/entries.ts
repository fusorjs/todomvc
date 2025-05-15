export function* entries<K extends string | number | symbol, V>(
  obj: Record<K, V>,
) {
  for (const key in obj) yield [key, obj[key]] as [K, V];
}
