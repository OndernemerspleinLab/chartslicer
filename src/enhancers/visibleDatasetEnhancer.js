import { negate } from 'lodash/fp'
import { connect } from 'react-redux'
import { first, findLast, pickBy } from 'lodash/fp'
import { get, setIn, getIn } from '../helpers/getset'
import {
	isEqual,
	isBefore,
	compareAsc,
	addMonths,
	addQuarters,
	addYears,
} from 'date-fns'
import {
	visibleDatasetInfoConnector,
	dataEntriesConnector,
} from '../connectors/visibleDatasetQueryConnector'
import { existing } from '../helpers/helpers'
import { DIMENSION_TOPIC, minPeriodLength } from '../config'
import {
	topicsGetConnector,
	topicsConnector,
} from '../connectors/topicConnectors'
import { categoriesConnector } from '../connectors/categoryConnectors'
import { configConnector } from '../connectors/configConnectors'
import { getDimensionInfo } from './dimensionInfo/getDimensionInfo'
import { weakMemoize } from '../helpers/weakMemoize'
import { getGlobalDataProperties } from './dimensionInfo/getGlobalDataProperties'
import { getDimensionLabel } from './dimensionInfo/getDimensionLabel'

const getPeriodDate = get('periodDate')

const getAllPeriodDates = dataEntryList => {
	return dataEntryList
		.reduce((memo, dataEntry) => {
			const periodDate = getPeriodDate(dataEntry)

			if (!memo.some(memoDate => isEqual(memoDate, periodDate))) {
				memo.push(periodDate)
			}

			return memo
		}, [])
		.sort(compareAsc)
}

const addValueForTopicKeyToMemo = ({ periodDate, dataEntry }) => (
	memo,
	topicKey,
) => {
	const value = getIn(['values', topicKey])(dataEntry)
	if (existing(value)) {
		return setIn([topicKey, periodDate], value)(memo)
	}

	return memo
}
const addValueForCategoryKeyToMemo = ({
	dataEntry,
	periodDate,
	topicKey,
	categoryKey,
}) => memo => {
	const value = getIn(['values', topicKey])(dataEntry)
	if (existing(value)) {
		return setIn([categoryKey, periodDate], value)(memo)
	}

	return memo
}

const arrangeValuesByDimension = ({
	dataEntryList,
	multiDimension,
	topicKeys,
	categoryKeys,
}) => {
	if (!multiDimension) {
		const topicKey = first(topicKeys)

		const valuesByDimension = dataEntryList.reduce((memo, dataEntry) => {
			const periodDate = getPeriodDate(dataEntry)

			return addValueForTopicKeyToMemo({ periodDate, dataEntry })(
				memo,
				topicKey,
			)
		}, {})

		return valuesByDimension
	}

	if (multiDimension === DIMENSION_TOPIC) {
		const valuesByDimension = dataEntryList.reduce((memo, dataEntry) => {
			const periodDate = getPeriodDate(dataEntry)

			return topicKeys.reduce(
				addValueForTopicKeyToMemo({ periodDate, dataEntry }),
				memo,
			)
		}, {})

		return valuesByDimension
	}

	const topicKey = first(topicKeys)

	const valuesByDimension = dataEntryList.reduce((memo, dataEntry) => {
		const periodDate = getPeriodDate(dataEntry)
		const categoryKey = getIn(['categories', multiDimension])(dataEntry)

		return addValueForCategoryKeyToMemo({
			dataEntry,
			categoryKey,
			periodDate,
			topicKey,
		})(memo)
	}, {})

	return valuesByDimension
}

const hasEnoughValuesForDimension = valuesForDimension =>
	Object.keys(valuesForDimension).length > minPeriodLength

const getDimensionKeys = valuesByDimension =>
	Object.keys(pickBy(hasEnoughValuesForDimension)(valuesByDimension))

const getKeysForMultiDimension = ({
	multiDimension,
	topicKeys,
	categoryKeys,
}) => {
	return !multiDimension || multiDimension === DIMENSION_TOPIC
		? topicKeys
		: categoryKeys[multiDimension]
}
const getRejectedDimensionKeys = ({
	multiDimension,
	topicKeys,
	categoryKeys,
	acceptedDimensionKeys,
}) => {
	const allDimensionKeys = getKeysForMultiDimension({
		multiDimension,
		topicKeys,
		categoryKeys,
	})
	const rejectedDimensionKeys = allDimensionKeys.filter(
		dimensionKey => !acceptedDimensionKeys.includes(dimensionKey),
	)

	return rejectedDimensionKeys
}

const hasValueForPeriod = ({
	periodDate,
	valuesByDimension,
}) => dimensionKey => {
	return existing(getIn([dimensionKey, periodDate])(valuesByDimension))
}

const getPeriodDateIncrementer = periodType => {
	switch (periodType) {
		case 'Maanden':
			return addMonths
		case 'Kwartalen':
			return addQuarters
		case 'Jaar':
			return addYears
		default:
			throw new Error(`Invalid periodType: ${periodType}`)
	}
}

const getPeriodDatesInRange = ({
	allPeriodDates,
	periodType,
	dimensionKeys,
	valuesByDimension,
}) => {
	const startDate = allPeriodDates.find(periodDate => {
		return dimensionKeys.some(
			hasValueForPeriod({ periodDate, valuesByDimension }),
		)
	})

	if (!startDate) {
		return []
	}

	const endDate = findLast(periodDate => {
		return dimensionKeys.some(
			hasValueForPeriod({ periodDate, valuesByDimension }),
		)
	})(allPeriodDates)

	if (!endDate) {
		return []
	}

	const dateIncrementer = getPeriodDateIncrementer(periodType)

	const periodDatesInRange = []
	let date = startDate

	while (isBefore(date, endDate) || isEqual(date, endDate)) {
		periodDatesInRange.push(date)
		date = dateIncrementer(date, 1)
	}

	return periodDatesInRange
}

export const visibleDataInfoConnector = weakMemoize(state => {
	const visibleDatasetInfo = visibleDatasetInfoConnector(state)
	const dataEntries = dataEntriesConnector(state)
	const {
		multiDimension,
		topicKeys,
		categoryKeys,
		dataList,
		periodType,
	} = visibleDatasetInfo

	const dataEntryList = dataList.map(dataEntryId =>
		get(dataEntryId)(dataEntries),
	)

	const allPeriodDates = getAllPeriodDates(dataEntryList)

	const valuesByDimension = arrangeValuesByDimension({
		dataEntryList,
		multiDimension,
		topicKeys,
		categoryKeys,
	})

	const dimensionKeys = getDimensionKeys(valuesByDimension)
	const rejectedDimensionKeys = getRejectedDimensionKeys({
		multiDimension,
		topicKeys,
		categoryKeys,
		acceptedDimensionKeys: dimensionKeys,
	})

	const topics = topicsConnector(state)
	const categories = categoriesConnector(state)
	const { labelAliases = {} } = configConnector(state)

	const periodDatesInRange = getPeriodDatesInRange({
		allPeriodDates,
		dimensionKeys,
		periodType,
		valuesByDimension,
	})

	const dimensionInfo = getDimensionInfo({
		dimensionKeys,
		valuesByDimension,
		multiDimension,
		selectedTopics: topics,
		selectedCategories: categories,
		labelAliases,
		periodDatesInRange,
	})

	const rejectedDimensionInfo = rejectedDimensionKeys.map(dimensionKey => {
		return {
			dimensionKey,
			...getDimensionLabel({
				multiDimension,
				selectedTopics: topics,
				selectedCategories: categories,
				labelAliases,
				dimensionKey,
			}),
		}
	})

	const globalDataProperties = getGlobalDataProperties(dimensionInfo)

	const { unit, decimals } = topicsGetConnector(first(topicKeys))(state)

	return {
		...visibleDatasetInfo,
		...globalDataProperties,
		valuesByDimension,
		dimensionInfo,
		rejectedDimensionInfo,
		periodDatesInRange,
		unit,
		decimals,
	}
})

export const visibleDatasetEnhancer = connect(visibleDataInfoConnector)
