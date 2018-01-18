import { SingleCheckbox } from './Elements'
import React from 'react'
import { multiDimensionOptionEnhancer } from '../enhancers/configEnhancers'
import { slugify } from '../helpers/helpers'

const MultiDimensionOptionComp = props => {
	const checked = props.value === props.inputValue

	return (
		<SingleCheckbox
			{...props}
			checked={checked}
			name={slugify(props.inputValue)}
		/>
	)
}

export const MultiDimensionOption = multiDimensionOptionEnhancer(
	MultiDimensionOptionComp,
)
