import { pure } from 'recompose'
import React from 'react'

const listenOn = (eventName, callback, options) => target => {
  target.addEventListener(eventName, callback, options)

  return () => {
    target.removeEventListener(eventName, callback, options)
  }
}
const listenOnce = (eventName, callback, options) => target => {
  const off = listenOn(eventName, event => (off(), callback(event)), options)(
    target
  )

  return off
}

export const TablePickerInput = pure(({ tableUrl, onTableFieldChange }) => (
  <p>
    <label htmlFor="tableIdInput">Tabel URL of ID</label>
    <input
      type="text"
      value={tableUrl}
      onPaste={event =>
        listenOnce('input', event =>
          console.log('onPaster', event.currentTarget.value)
        )(event.currentTarget)}
      id="tableIdInput"
      placeholder="bijv. ‘https://opendata.cbs.nl/#/CBS/nl/dataset/82439NED/line?graphtype=Line’ of ‘81573NED’"
    />
  </p>
))
