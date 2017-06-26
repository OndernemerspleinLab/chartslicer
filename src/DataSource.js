import React from 'react'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { compose } from 'recompose'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { fadeInAnimation } from './styles'
import { activeDatasetIdConnector } from './connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'

const Link = glamorous.a({
  color: hemelblauw.default,
})

const CreativeCommonsLink = () =>
  <Link
    target="_blank"
    href="https://creativecommons.org/licenses/by/3.0/nl/"
    title="Create Commons Naamsvermelding 3.0 Nederland"
  >
    CC BY 3.0 NL
  </Link>

const CbsLink = ({ id }) =>
  <Link
    target="_blank"
    href={`https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/table`}
  >
    CBS
  </Link>

const DataSourceComp = glamorous.div({
  padding: '0 3rem',
  backgroundColor: hemelblauw.lighter,
  animation: fadeInAnimation,
  maxWidth: '60rem',
})

const DataSourceContainer = ({ activeDatasetId }) =>
  <DataSourceComp css={{ marginTop: '2rem' }}>
    Data afkomstig van <CbsLink id={activeDatasetId} /> (<CreativeCommonsLink />)
  </DataSourceComp>

export const DataSource = compose(
  onlyWhenVisibleDataset,
  connect(activeDatasetIdConnector)
)(DataSourceContainer)
