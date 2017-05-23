import React from 'react'
import { StepTitle, Step } from './Elements'
import { CallToActionLink } from '../CallToAction'

const statLineUrl = 'https://opendata.cbs.nl/'

export const Intro = () => (
  <Step>
    <StepTitle>Zoek een dataset bij CBS StatLine</StepTitle>
    <CallToActionLink href={statLineUrl} target="_bank">
      CBS StatLine
    </CallToActionLink>
  </Step>
)
