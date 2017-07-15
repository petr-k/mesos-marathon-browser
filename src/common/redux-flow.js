// @flow

/* eslint-disable */

export function returnTypeOf<T>(fn: (...params: any[]) => T): T {
  const r: any = null
  return (r: T)
}
