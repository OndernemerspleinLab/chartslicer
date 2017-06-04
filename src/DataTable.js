import React from 'react'
import { compose } from 'recompose'
import {
  onlyWhenLoaded,
  connectFilteredDataset,
  connectDataInfo,
  onlyWhenData,
} from './higherOrderComponents'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { connectPeriodFormatter } from './cbsPeriod'

const enhancer = compose(
  onlyWhenLoaded,
  connectDataInfo,
  connectPeriodFormatter,
  connectFilteredDataset,
  onlyWhenData
)

const DataTableComp = glamorous.div({
  padding: '0 3rem',
  backgroundColor: hemelblauw.lighter,
  animation: fadeInAnimation,
})

const Table = glamorous.table({})

const TableHead = glamorous.thead()
const Tablebody = glamorous.tbody()

const Row = glamorous.tr({
  backgroundColor: hemelblauw.lightest,
  ':nth-child(2n)': {
    backgroundColor: wit,
  },
})

const HeadingRow = glamorous.tr({
  backgroundColor: hemelblauw.darker,
  color: wit,
})

const cellStyle = {
  padding: '0.2rem 1.2rem',
}
const Cell = glamorous.td(cellStyle)

const HeadingCell = glamorous.th(cellStyle)

const DataTableContainer = ({
  topicKey,
  topic: { Unit, Title },
  data,
  formatPeriod,
  periodType,
}) =>
  <DataTableComp>
    <InsideMargin top="2rem" bottom="2rem">
      <Table>
        <TableHead>
          <HeadingRow>
            <HeadingCell>
              {periodType}
            </HeadingCell>
            <HeadingCell>
              {Title} ({Unit})
            </HeadingCell>
          </HeadingRow>
        </TableHead>
        <Tablebody>
          {data.map(entry =>
            <Row key={entry.ID}>
              <Cell>
                {formatPeriod(entry.Perioden)}
              </Cell>
              <Cell>
                {entry[topicKey]}
              </Cell>
            </Row>
          )}
        </Tablebody>
      </Table>
    </InsideMargin>
  </DataTableComp>

export const DataTable = enhancer(DataTableContainer)
