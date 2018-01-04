import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { connect } from 'react-redux'
import { formatCbsPeriod, getCbsPeriodLabel } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import { visibleDataAsTableEnhancer } from './enhancers/visibleDataTableEnhancer'
import { onlyWhenChildren } from './enhancers/onlyWhenChildren'
import { LabelEditButton } from './LabelEditButton'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
  visibleDataAsTableEnhancer
)

const DataTableComp = glamorous.div({
  backgroundColor: hemelblauw.lighter,
  animation: fadeInAnimation,
})

const Table = glamorous.table({
  lineHeight: 1.2,
})

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

const ValueHeadingCell = ({
  title,
  info,
  type,
  unit,
  activeDatasetId,
  index,
}) => (
  <HeadingCell>
    <LabelEditButton
      title={title}
      info={info}
      type={type}
      activeDatasetId={activeDatasetId}
      index={index}
    >
      Label aanpassen
    </LabelEditButton>{' '}
    {title} <Unit>{unit}</Unit>
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
  id,
}) => {
  const periodLabel = getCbsPeriodLabel({ language, periodType })

  return (
    <DataTableComp>
      <InsideMargin top="2rem" bottom="2rem">
        <Table>
          <TableHead>
            <HeadingRow>
              <HeadingCell>{periodLabel}</HeadingCell>
              {titles.map(({ title, type, info }, index) => (
                <ValueHeadingCell
                  activeDatasetId={id}
                  key={index}
                  index={index}
                  unit={unit}
                  title={title}
                  info={info}
                  type={type}
                />
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
