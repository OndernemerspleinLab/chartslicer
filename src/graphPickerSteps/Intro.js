import React from 'react'
import { StepTitle, CallToAction, Step } from './Elements'

const statLineUrl = 'https://opendata.cbs.nl/'

export const Intro = () => (
  <Step>
    <StepTitle>Zoek een dataset bij CBS StatLine</StepTitle>
    <CallToAction href={statLineUrl} target="_bank">CBS StatLine</CallToAction>
  </Step>
)
