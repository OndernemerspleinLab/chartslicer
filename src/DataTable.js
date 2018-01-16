import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { connect } from 'react-redux'
import { formatSingleLineCbsPeriod, getCbsPeriodLabel } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { getIn } from './helpers/getset'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import { onlyWhenChildren } from './enhancers/onlyWhenChildren'
import { LabelEditButton } from './LabelEditButton'
import {
  visibleDatasetEnhancer,
  onlyWhenValidDimension,
} from './enhancers/visibleDatasetEnhancer'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
  visibleDatasetEnhancer,
  onlyWhenValidDimension
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
  alias,
  title,
  info,
  dimensionType,
  unit,
  activeDatasetId,
  index,
}) => (
  <HeadingCell>
    <LabelEditButton
      alias={alias}
      info={info}
      dimensionType={dimensionType}
      activeDatasetId={activeDatasetId}
      index={index}
    >
      Label aanpassen
    </LabelEditButton>{' '}
    {title} <Unit>{unit}</Unit>
  </HeadingCell>
)

const DataRow = ({
  periodType,
  periodDate,
  dimensionInfo,
  valuesByDimension,
  decimals,
}) => (
  <Row>
    <Cell>{formatSingleLineCbsPeriod(periodType)(periodDate)}</Cell>
    {dimensionInfo.map(({ dimensionKey, type, info, alias }, index) => {
      const value = getIn([dimensionKey, periodDate])(valuesByDimension)

      return <Cell key={index}>{formatNumber(decimals)(value)}</Cell>
    })}
  </Row>
)

const DataTableContainer = ({
  language,
  periodType,
  dimensionInfo,
  periodDatesInRange,
  valuesByDimension,
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
              {dimensionInfo.map(
                (
                  {
                    dimensionLabel,
                    dimensionLabelAlias,
                    dimensionType,
                    info,
                    alias,
                  },
                  index
                ) => (
                  <ValueHeadingCell
                    activeDatasetId={id}
                    key={index}
                    index={index}
                    unit={unit}
                    title={dimensionLabel}
                    alias={dimensionLabelAlias}
                    info={info}
                    dimensionType={dimensionType}
                  />
                )
              )}
            </HeadingRow>
          </TableHead>
          <Tablebody>
            {periodDatesInRange.map(periodDate => (
              <DataRow
                key={periodDate}
                periodDate={periodDate}
                decimals={decimals}
                periodType={periodType}
                dimensionInfo={dimensionInfo}
                valuesByDimension={valuesByDimension}
              />
            ))}
          </Tablebody>
        </Table>
      </InsideMargin>
    </DataTableComp>
  )
}

export const DataTable = enhancer(DataTableContainer)
