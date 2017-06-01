import React from 'react'
import { compose } from 'recompose'
import { onlyWhenLoaded, connectFilteredDataset } from './higherOrderComponents'
import glamorous from 'glamorous'

const enhancer = compose(onlyWhenLoaded, connectFilteredDataset)

const DataTableComp = glamorous.div({
  padding: '1rem 3rem',
})

const DataTableContainer = ({ topicKey, data }) => (
  <DataTableComp>
    <table>
      <thead>
        <tr>
          <th>
            Periode
          </th>
          <th>
            {topicKey}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(entry => (
          <tr key={entry.ID}>
            <td>
              {entry.Perioden}
            </td>
            <td>
              {entry[topicKey]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </DataTableComp>
)

export const DataTable = enhancer(DataTableContainer)
