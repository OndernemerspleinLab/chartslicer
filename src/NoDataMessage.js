import React from 'react'
import { onlyWhenVisibleDatasetHasNoData } from './enhancers/datasetGuardEnhancer'
import { MainErrorMessage, StepTitle } from './graphPickerSteps/Elements'
import glamorous from 'glamorous'

const NoDataMessageComponent = () => {
	return (
		<MainErrorMessage>
			<StepTitle>Geen data beschikbaar voor deze configuratie</StepTitle>
		</MainErrorMessage>
	)
}
export const NoDataMessage = onlyWhenVisibleDatasetHasNoData(
	NoDataMessageComponent,
)
