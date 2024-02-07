/**
 * @author        shunzi <tobyzsj@gmail.com>
 * @date          2024-02-08 01:16:08
 */

/**
 * empty object
 */
export type EmptyObject = Record<any, never>

/**
 * any function
 */
export type AnyFunction = (...args: any[]) => any

/**
 * match any constructor
 */
export interface AnyConstructor {
  new (...args: any[]): any
}

/**
 * Promise, or maybe not
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined

/**
 * any to Array
 *
 * eg: ToArray<string | string[]> => string[]
 */
export type ToArray<T> = T extends any[] ? T : T[]

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends Array<infer V> ? V : never

/**
 * Constructor
 */
export type Constructor<T = void> = new (...args: any[]) => T

/**
 * Constructor of instance
 */
export type ConstructorOf<T> = new (...args: any[]) => T

/**
 * tuple to union
 *
 * eg: TupleToUnion<[1,2,3,4]> => 1 | 2 | 3 | 4
 */
export type TupleToUnion<T> = T extends (infer U)[]
  ? U
  : T extends readonly (infer U)[]
    ? U
    : never

/**
 * pick safe
 *
 * Pick the keys of T, if the key is not in T, it will be ignored
 *
 * eg: PickSafe<{ a: string; b: number }, 'a' | 'c'> => { a: string }
 */
export type Pick<T, K extends keyof T | string> = {
  [P in K]: P extends keyof T ? T[P] : never
}

/**
 * interface => type
 *
 * eg:
 * interface A {
 *    a: string
 *    b: number
 * }
 * type B = { c: string }
 * InterfaceToType<A & B> => { a: string; b: number; c: string }
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

/**
 * test if T is equal to U
 */
export type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? true
  : false

/**
 *
 */
export type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true
  ? never
  : KeyType extends ExcludeType
    ? never
    : KeyType

/**
 *
 */
export type Except<ObjectType, KeysType extends keyof ObjectType> = {
  [KeyType in keyof ObjectType as Filter<
    KeyType,
    KeysType
  >]: ObjectType[KeyType]
}

/**
 * set some key into optional
 *
 * eg: SetOptional<{ a: string; b: number }, 'a'> => { a?: string; b: number }
 */
export type SetOptional<
BaseType,
Keys extends keyof BaseType | string,
> = Simplify<
// Pick just the keys that are readonly from the base type.
  Omit<BaseType, Keys> &
    // Pick the keys that should be mutable from the base type and make them mutable.
  Partial<Pick<BaseType, Keys>>
>

/**
 * pick keys which starts with S
 *
 * eg: PickStartsWith<{ abb: string; abc: number; bc: string }, 'ab'> => { abb: string; abc: number; }
 */
export type PickStartsWith<T extends object, S extends string> = {
  // eslint-disable-next-line unused-imports/no-unused-vars
  [K in keyof T as K extends `${S}${infer R}` ? K : never]: T[K]
}
