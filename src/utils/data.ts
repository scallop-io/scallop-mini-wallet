export const isObject = (variable: unknown): variable is Record<string, unknown> => {
  return typeof variable === 'object' && variable !== null;
};

export const hasOwnProperty = <X extends Record<string, unknown>, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return {}.propertyIsEnumerable.call(obj, prop);
};

export const capitalizeFirstChar = (str: string): string =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const chunks = <T>(array: T[], size: number): T[][] => {
  return Array.apply<number, T[], T[][]>(0, new Array<T>(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
};

/**
 * Returns the object with undefined properties removed.
 *
 * @param object Target object.
 * @returns New object.
 */
export const compact = <T extends Record<any, any>>(object: T) => {
  const clone = Object.assign({}, object);
  for (const key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }
  return clone;
};

/**
 * Get new omitted object by giving specific keys.
 *
 * @param object Target object.
 * @param keysToOmit Key to omit.
 * @returns New omitted object.
 */
export const omit = <T extends Record<string, any>>(object: T, keysToOmit: string[] = []) => {
  const clone: T = Object.assign({}, object);
  for (const key of keysToOmit) {
    if (key in clone) delete clone[key];
  }
  return clone;
};

/**
 * Find the matching value or callback function from the object record (then bring in the given corresponding parameters).
 *
 * @param value The target key to match.
 * @param handlers Objects that contain matching items.
 * @param args If the matched return is a function, then this is the corresponding parameter of the function.
 * @returns Match item.
 */
export const matchHandler = <T extends string | number = string, TReturnType = unknown>(
  value: T,
  handlers: Record<T, TReturnType | ((...args: any[]) => TReturnType)>,
  ...args: any[]
): TReturnType => {
  if (value in handlers) {
    const returnValue = handlers[value];
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue;
  }

  const error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      handlers
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, matchHandler);
  throw error;
};
