import React from 'react'
import { StepTitle, Step } from './Elements'
import { CallToActionLink } from '../CallToAction'
import {
  environmentLanguageConnector,
  getEvironmentLanguageLabel,
} from '../connectors/environmentLanguageConnectors'
import { connect } from 'react-redux'
import { getStatLineUrl } from '../config'

export const IntroComponent = ({ environmentLanguage }) => (
  <Step>
    <StepTitle>Zoek een dataset bij CBS StatLine</StepTitle>
    <CallToActionLink href={getStatLineUrl(environmentLanguage)} target="_bank">
      CBS StatLine {getEvironmentLanguageLabel(environmentLanguage)}
    </CallToActionLink>
  </Step>
)
export const Intro = connect(environmentLanguageConnector)(IntroComponent)
