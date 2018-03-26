import React from 'react'
import { StepTitle, Step, Frag } from './Elements'
import { CallToActionLink } from '../CallToAction'
import { environmentLanguageConnector } from '../connectors/environmentLanguageConnectors'
import { connect } from 'react-redux'
import { getStatLineUrl } from '../config'
import { EnvironmentLanguage } from '../EnvironmentLanguage'

const StatLineNL = () => (
	<CallToActionLink href={getStatLineUrl('nl')} target="_bank">
		CBS StatLine
	</CallToActionLink>
)

const StatLineEN = () => (
	<CallToActionLink href={getStatLineUrl('en')} target="_bank">
		English
	</CallToActionLink>
)

const StatlineNLAndEN = () => (
	<Frag>
		<StatLineNL />
		<StatLineEN />
	</Frag>
)

export const IntroComponent = ({ environmentLanguage }) => (
	<Step marginBottom={0}>
		<StepTitle>Zoek een dataset bij CBS StatLine</StepTitle>
		<EnvironmentLanguage NL={StatLineNL} EN={StatlineNLAndEN} />
	</Step>
)
export const Intro = connect(environmentLanguageConnector)(IntroComponent)
