import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import {
  visibleDatasetInfoConnector,
  dataEntryConnector,
} from './connectors/visibleDatasetQueryConnector'
import { connect } from 'react-redux'
import { topicConnector } from './connectors/topicConnectors'
import { get } from './helpers/getset'
import { formatCbsPeriod, getCbsPeriodLabel } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import { visibleDataAsTableEnhancer } from './enhancers/visibleDataTableEnhancer'
import { onlyWhenChildren } from './enhancers/onlyWhenChildren'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
  visibleDataAsTableEnhancer
)

const DataTableComp = glamorous.div({
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

const UnitElement = glamorous.span({
  fontSize: '0.7em',
})

const UnitContainer = ({ children }) => <UnitElement>({children})</UnitElement>

const Unit = onlyWhenChildren(UnitContainer)

const ValueHeadingCell = ({ children, unit }) => (
  <HeadingCell>
    {children} <Unit>{unit}</Unit>
  </HeadingCell>
)

const DataRow = ({ periodType, periodDate, values, decimals }) => (
  <Row>
    <Cell>{formatCbsPeriod(periodType)(' ')(periodDate)}</Cell>
    {values.map((value, index) => (
      <Cell key={index}>{formatNumber(decimals)(value)}</Cell>
    ))}
  </Row>
)

const DataTableContainer = ({
  topicKeys,
  titles = [],
  tableRows = [],
  columnCount,
  periodType,
  language,
  unit,
  decimals,
}) => {
  const topicKey = get(0)(topicKeys)
  const periodLabel = getCbsPeriodLabel({ language, periodType })

  return (
    <DataTableComp>
      <InsideMargin top="2rem" bottom="2rem">
        <Table>
          <TableHead>
            <HeadingRow>
              <HeadingCell>{periodLabel}</HeadingCell>
              {titles.map((title, index) => (
                <ValueHeadingCell key={index} unit={unit}>
                  {title}
                </ValueHeadingCell>
              ))}
            </HeadingRow>
          </TableHead>
          <Tablebody>
            {tableRows.map(tableRow => (
              <DataRow
                key={tableRow.periodDate}
                {...tableRow}
                decimals={decimals}
              />
            ))}
          </Tablebody>
        </Table>
      </InsideMargin>
    </DataTableComp>
  )
}

export const DataTable = enhancer(DataTableContainer)
