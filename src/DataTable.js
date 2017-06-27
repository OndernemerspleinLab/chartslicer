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
import { formatCbsPeriod } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(visibleDatasetInfoConnector)
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

const TopicHeadingCell = connect(topicConnector)(({ title, unit }) =>
  <HeadingCell>{title} ({unit})</HeadingCell>
)

const DataRow = connect((state, ownProps) => {
  return {
    topic: topicConnector(state, ownProps),
    ...dataEntryConnector(state, ownProps),
  }
})(props =>
  <Row>
    <Cell>
      {formatCbsPeriod(props.periodType)(props.periodDate)}
    </Cell>
    <Cell>
      {formatNumber(props.topic.decimals)(props[props.topicKey])}
    </Cell>
  </Row>
)

const DataTableContainer = ({ topicKeys, dataList = [], periodType }) => {
  const topicKey = get(0)(topicKeys)

  return (
    <DataTableComp>
      <InsideMargin top="2rem" bottom="2rem">
        <Table>
          <TableHead>
            <HeadingRow>
              <HeadingCell>
                {periodType}
              </HeadingCell>
              <TopicHeadingCell topicKey={topicKey} />
            </HeadingRow>
          </TableHead>
          <Tablebody>
            {dataList.map(entryId =>
              <DataRow topicKey={topicKey} entryId={entryId} key={entryId} />
            )}
          </Tablebody>
        </Table>
      </InsideMargin>
    </DataTableComp>
  )
}

export const DataTable = enhancer(DataTableContainer)
