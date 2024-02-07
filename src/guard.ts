/**
 * @author        shunzi <tobyzsj@gmail.com>
 * @date          2024-02-08 01:43:37
 */

import type { AnyFunction } from './types'

/**
 * test is function
 */
export function isFunction<T extends AnyFunction>(
  maybeFn: any,
): maybeFn is T {
  return typeof maybeFn === 'function'
}
