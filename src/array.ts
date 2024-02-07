/**
 * @author        shunzi <tobyzsj@gmail.com>
 * @date          2024-02-08 01:16:01
 */

import { isFunction } from './guard'
import type { Arrayable, Nullable } from './types'

/**
 * any to array
 *
 */
export function toArray<T>(value?: Nullable<Arrayable<T>>): T[] {
  value = value ?? []
  return Array.isArray(value) ? value : [value]
}

/**
 * deduplicate Array
 */
export function deduplicatArray<T>(array: T[], itemRef?: keyof T | (keyof T)[] | ((item: T) => any)): T[] {
  const refSet = new Set()
  const deduplicated: T[] = []

  function getItemRef(item: T) {
    if (isFunction(itemRef))
      return itemRef(item)
    if (
      typeof itemRef === 'string'
      || (Array.isArray(itemRef)
      && itemRef.every(item => typeof item === 'string'))
    ) {
      const refKeys = toArray(itemRef)
      const refs: any[] = []

      refKeys.forEach((key) => {
        if (typeof key !== 'string')
          return
        const ref = item[key as keyof T]
        refs.push(ref)
      })

      return refs
    }

    return item
  }

  function refInRefSet(refs: any[]) {
    if (Array.isArray(refs))
      return refs.every(ref => refSet.has(ref))
    else
      return refSet.has(refs)
  }

  array.forEach((item) => {
    const refs = getItemRef(item)
    if (Array.isArray(refs)) {
      if (refInRefSet(refs))
        return
      deduplicated.push(item)
      refs.forEach((ref) => {
        refSet.add(ref)
      })
    }
    else {
      if (refInRefSet(refs))
        return
      deduplicated.push(item)
      refSet.add(refs)
    }
  })

  return deduplicated
}

/**
 * sourceArr 数组按照 referenceArr 的顺序排序，返回的是新数组
 *
 * config 提供两个方法用于 获取原数组和排序数组的引用，
 * 排序基于 Ref 的比较，如果不提供则 ref 是数组项本身，
 * ref未匹配的项会被忽略
 * @param sourceArr 原数组
 * @param referenceArr 目标顺序数组
 * @param config 配置
 * @param config.getRefFromSource 配置
 * @param config.getRefFromReference 配置
 */
export function sortArrayAsAnother<
    Source extends unknown[],
    Ref extends unknown[],
>(
  sourceArr: Source,
  referenceArr: Ref,
  config?: {
    getRefFromSource?: (source: Source[number]) => any
    getRefFromReference?: (reference: Ref[number]) => any
  },
): Source {
  const { getRefFromSource, getRefFromReference } = config || {}

  const result: Source = [] as unknown as Source

  const tempMap = sourceArr.reduce((map: Map<any, Source[number]>, source) => {
    let ref = source
    if (isFunction(getRefFromSource))
      ref = getRefFromSource(source)

    map.set(ref, source)
    return map
  }, new Map<any, Source[number]>())

  referenceArr.forEach((reference) => {
    let ref = reference
    if (isFunction(getRefFromReference))
      ref = getRefFromReference(reference)

    const target = tempMap.get(ref)

    if (target)
      result.push(target)
  })

  return result
}
