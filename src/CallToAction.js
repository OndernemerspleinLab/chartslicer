import glamorous from 'glamorous'
import { css } from 'glamor'
import { violet, wit } from './colors'
import { ChevronRight } from './svg/ChevronRight'
import React from 'react'
import { InlineMedia, MediaText, MediaFigure } from './Media'
import { square } from './styleHelpers'
import { Hidden } from './graphPickerSteps/Elements'
import { borderRadius, borderRadiusOnlyRight } from './styles'

const callToActionStyle = css(
  {
    border: 'none',
    fontWeight: 'bold',
    padding: '0.5rem 0.6rem 0.3rem 0.6rem',
    textDecoration: 'none',
    background: violet.default,
    color: wit,
    fill: wit,
    display: 'inline-block',
    lineHeight: 1.15,
  },
  borderRadius
)

const CallToActionIcon = glamorous(ChevronRight)(square('1.2em'), {
  marginRight: '-0.3em',
})

const CallToActionInner = props => (
  <InlineMedia {...props}>
    <MediaText>{props.children}</MediaText>
    <MediaFigure><CallToActionIcon /></MediaFigure>
  </InlineMedia>
)

export const CallToAction = glamorous(props => (
  <button {...props}>
    <CallToActionInner>{props.children}</CallToActionInner>
  </button>
))(callToActionStyle)

export const CallToActionLink = glamorous(props => (
  <a {...props} className={callToActionStyle}>
    <CallToActionInner>{props.children}</CallToActionInner>
  </a>
))(callToActionStyle)

export const Submit = glamorous(props => (
  <button type="submit" {...props}>
    <Hidden>{props.children}</Hidden>
    <CallToActionIcon />
  </button>
))(callToActionStyle, borderRadiusOnlyRight, {
  paddingLeft: '0.3em',
  paddingRight: '0.6em',
})
