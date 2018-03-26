import React from 'react'
import { environmentLanguageConnector } from './connectors/environmentLanguageConnectors'
import { connect } from 'react-redux'

export const EnvironmentLanguage = connect(environmentLanguageConnector)(
	props => {
		const { environmentLanguage, EN, NL, ...restProps } = props

		switch (environmentLanguage) {
			case 'en':
				return <EN {...restProps} />
			case 'nl':
			default:
				return <NL {...restProps} />
		}
	},
)
