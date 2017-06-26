type WeakMemoizableFunc<IN, OUT> = (arg: IN) => OUT

export const weakMemoize = <IN, OUT>(
  fn: WeakMemoizableFunc<IN, OUT>
): WeakMemoizableFunc<IN, OUT> => {
  const cache: WeakMap<IN, OUT> = new WeakMap()

  return (arg: IN): OUT => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg))
    }
    // Type any because if the cache was empty it has just been filled
    const result: any = cache.get(arg)

    return result
  }
}
