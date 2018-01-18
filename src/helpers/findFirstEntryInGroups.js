import { getIn, get } from '../helpers/getset'
import { existing, unexisting } from '../helpers/helpers'

const getFirstEntry = entriesPropName => getIn([entriesPropName, 0])

export const findFirstEntryInGroups = ({
	groups,
	groupsPropName,
	entriesPropName,
	currentGroupKey = 'root',
}) => {
	const group = get(currentGroupKey)(groups)

	if (unexisting(group)) {
		return undefined
	}

	const firstEntry = getFirstEntry(entriesPropName)(group)

	if (existing(firstEntry)) {
		return firstEntry
	}

	const subgroupKeys = get(groupsPropName)(group) || []

	for (let subgroupKey of subgroupKeys) {
		const entry = findFirstEntryInGroups({
			groups,
			groupsPropName,
			entriesPropName,
			currentGroupKey: subgroupKey,
		})

		if (entry) {
			return entry
		}
	}

	return undefined
}
