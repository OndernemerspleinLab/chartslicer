import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { InsideMargin, Hidden, CenterText } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import {
	onlyWhenDataAvailable,
	onlyWhenVisibleDataset,
} from './enhancers/datasetGuardEnhancer'
import { connect } from 'react-redux'
import { formatSingleLineCbsPeriod, getCbsPeriodLabel } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { getIn, get } from './helpers/getset'
import { onlyWhenChildren } from './enhancers/onlyWhenChildren'
import { LabelEditButton } from './LabelEditButton'
import { visibleDatasetEnhancer } from './enhancers/visibleDatasetEnhancer'
import { environmentLanguageConnector } from './connectors/environmentLanguageConnectors'

const enhancer = compose(
	onlyWhenVisibleDataset,
	connect(environmentLanguageConnector),
	visibleDatasetEnhancer,
	onlyWhenDataAvailable,
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
	unitAlias,
	title,
	info,
	dimensionType,
	unitInfo,
	activeDatasetId,
	index,
}) => (
	<HeadingCell>
		<CenterText>
			<LabelEditButton
				alias={alias}
				info={info}
				dimensionType={dimensionType}
				activeDatasetId={activeDatasetId}
				index={index}
			>
				<Hidden>Label aanpassen</Hidden>
				{title}
			</LabelEditButton>
		</CenterText>
		<CenterText>
			<LabelEditButton
				alias={get('alias')(unitInfo)}
				info={unitInfo}
				dimensionType={'unit'}
				activeDatasetId={activeDatasetId}
				index={`${index}-unit`}
			>
				<Hidden>Label aanpassen</Hidden>
				<Unit>{get('unitLabel')(unitInfo)}</Unit>
			</LabelEditButton>
		</CenterText>
	</HeadingCell>
)

const DataRow = ({
	periodType,
	periodDate,
	dimensionInfo,
	valuesByDimension,
	decimals,
	language,
}) => (
	<Row>
		<Cell>
			{formatSingleLineCbsPeriod({ language, periodType })(periodDate)}
		</Cell>
		{dimensionInfo.map(({ dimensionKey }, index) => {
			const value = getIn([dimensionKey, periodDate])(valuesByDimension)

			return (
				<Cell key={index}>{formatNumber({ decimals, language })(value)}</Cell>
			)
		})}
	</Row>
)

const DataTableContainer = ({
	environmentLanguage,
	periodType,
	dimensionInfo,
	periodDatesInRange,
	valuesByDimension,
	unitInfo,
	id,
}) => {
	const periodLabel = getCbsPeriodLabel({
		language: environmentLanguage,
		periodType,
	})

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
									index,
								) => (
									<ValueHeadingCell
										activeDatasetId={id}
										key={index}
										index={index}
										unitInfo={unitInfo}
										title={dimensionLabel}
										alias={dimensionLabelAlias}
										info={info}
										dimensionType={dimensionType}
									/>
								),
							)}
						</HeadingRow>
					</TableHead>
					<Tablebody>
						{periodDatesInRange.map(periodDate => (
							<DataRow
								language={environmentLanguage}
								key={periodDate}
								periodDate={periodDate}
								decimals={get('decimals')(unitInfo)}
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
