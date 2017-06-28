import React from 'react'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { compose } from 'recompose'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { fadeInAnimation } from './styles'
import { activeDatasetIdConnector } from './connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'
import { CreateCommonsBy, CreateCommonsLogo } from './CreativeCommons'
import { Hidden } from './graphPickerSteps/Elements'

const Link = glamorous.a({
  color: hemelblauw.default,
})

const CreativeCommonsLink = () =>
  <Link
    target="_blank"
    href="https://creativecommons.org/licenses/by/3.0/nl/"
    title="Create Commons Naamsvermelding 3.0 Nederland"
    css={{
      textDecoration: 'none',
    }}
  >
    <Hidden>CC BY 3.0 NL</Hidden>
    <CreateCommonsLogo /> <CreateCommonsBy />
  </Link>

const CbsLink = ({ id }) =>
  <Link
    target="_blank"
    href={`https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/table`}
  >
    CBS
  </Link>

const DataSourceComp = glamorous.div({
  animation: fadeInAnimation,
  maxWidth: '60rem',
  position: 'absolute',
  bottom: '0.6rem',
  right: '0.8rem',
  fontSize: '0.8rem',
})

const DataSourceContainer = ({ activeDatasetId }) =>
  <DataSourceComp css={{ marginTop: '2rem' }}>
    Bron: <CbsLink id={activeDatasetId} /> <CreativeCommonsLink />
  </DataSourceComp>

export const DataSource = compose(
  onlyWhenVisibleDataset,
  connect(activeDatasetIdConnector)
)(DataSourceContainer)
