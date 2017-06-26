export const listenOn = (eventName, callback, options) => target => {
  target.addEventListener(eventName, callback, options)

  return () => {
    target.removeEventListener(eventName, callback, options)
  }
}

export const listenOnce = (eventName, callback, options) => target => {
  const off = listenOn(
    eventName,
    event => {
      off()
      callback(event)
    },
    options
  )(target)

  return off
}

export const afterPaste = callback => event =>
  listenOnce('input', event => callback(event))(event.currentTarget)
