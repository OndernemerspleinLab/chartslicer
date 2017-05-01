import React from 'react'
import { TableIdInput } from './TableIdInput'
import { stateEnhancer } from './state'

const AppComponent = ({ tableId, onTableIdChange }) => (
  <div>
    <TableIdInput tableId={tableId} setTableId={onTableIdChange} />
    <p>{tableId}</p>
  </div>
)

export const App = stateEnhancer(AppComponent)
