import React from 'react'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { compose } from 'recompose'
import { onlyWhenVisibleDataset } from './enhancers/datasetGuardEnhancer'
import { fadeInAnimation } from './styles'
import { activeDatasetIdConnector } from './connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'
import { CreateCommonsBy, CreateCommonsLogo } from './CreativeCommons'
import { Hidden } from './graphPickerSteps/Elements'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import { EnvironmentLanguage } from './EnvironmentLanguage'
import { environmentLanguageConnector } from './connectors/environmentLanguageConnectors'
import { get } from './helpers/getset'

const Link = glamorous.a({
	color: hemelblauw.default,
})

const creativeCommonsLinkTitle = {
	nl: 'Creative Commons Naamsvermelding 4.0',
	en: 'Creative Commons Attribution 4.0',
}

const CreativeCommonsLink = ({ environmentLanguage }) => (
	<Link
		target="_blank"
		href={`https://creativecommons.org/licenses/by/4.0/deed.${environmentLanguage}`}
		title={get(environmentLanguage)(creativeCommonsLinkTitle)}
		css={{
			textDecoration: 'none',
		}}
	>
		<Hidden>CC BY 4.0</Hidden>
		<CreateCommonsLogo /> <CreateCommonsBy />
	</Link>
)

const CbsLink = ({ id, language }) => (
	<Link
		target="_blank"
		href={`https://opendata.cbs.nl/#/CBS/${language}/dataset/${id}/table`}
	>
		CBS
	</Link>
)

const DataSourceComp = glamorous.div({
	animation: fadeInAnimation,
	maxWidth: '60rem',
	position: 'absolute',
	bottom: '0.6rem',
	right: '0.8rem',
	fontSize: '0.8rem',
})

const DataSourceContainer = ({
	activeDatasetId,
	language,
	environmentLanguage,
}) => (
	<DataSourceComp css={{ marginTop: '2rem' }}>
		<EnvironmentLanguage NL={() => 'Bron: '} EN={() => 'Source: '} />
		<CbsLink id={activeDatasetId} language={language} />{' '}
		<CreativeCommonsLink
			language={language}
			environmentLanguage={environmentLanguage}
		/>
	</DataSourceComp>
)

export const DataSource = compose(
	onlyWhenVisibleDataset,
	connect(environmentLanguageConnector),
	connect(tableLanguageConnector),
	connect(activeDatasetIdConnector),
)(DataSourceContainer)
