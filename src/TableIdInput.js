import { pure } from 'recompose'
import React from 'react'

export const TableIdInput = pure(({ tableId, setTableId }) => (
  <p>
    <label htmlFor="tableIdInput">Tabel ID</label>
    <input
      type="text"
      value={tableId}
      onChange={setTableId}
      id="tableIdInput"
      placeholder="bijv. ‘81573NED’"
    />
  </p>
))
