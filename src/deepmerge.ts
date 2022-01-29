/**
 * Object check.
 *
 * @param item
 */
export function isObject(item: unknown): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 *
 * @param target
 * @param sources
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepmerge<T extends Record<string, any>>(
  target: T,
  ...sources: T[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepmerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepmerge(target, ...sources);
}
