import glamorous from 'glamorous'
import { css } from 'glamor'
import { violet, wit } from './colors'
import { ChevronRight } from './svg/ChevronRight'
import React from 'react'
import { InlineMedia, MediaText, MediaFigure } from './Media'
import { square } from './styleHelpers'
import { Hidden } from './graphPickerSteps/Elements'
import { borderRadius, borderRadiusOnlyRight } from './styles'

const rotateKeyframes = css.keyframes({
  from: {
    transform: 'rotateX(0deg)',
  },
  to: {
    transform: 'rotateX(180deg)',
  },
})

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

const CallToActionIcon = glamorous(ChevronRight, {
  displayName: 'CallToActionIcon',
})(
  square('1.2em'),
  {
    marginRight: '-0.3em',
  },
  ({ loading }) =>
    loading
      ? {
          animationName: rotateKeyframes,
          animationDuration: '600ms',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        }
      : null
)

const CallToActionInner = props => (
  <InlineMedia {...props}>
    <MediaText>{props.children}</MediaText>
    <MediaFigure><CallToActionIcon loading={props.loading} /></MediaFigure>
  </InlineMedia>
)
const CallToActionButton = glamorous.button({})
const CallToActionLinkComp = glamorous.a({})

export const CallToAction = glamorous(
  props => (
    <CallToActionButton {...props}>
      <CallToActionInner loading={props.loading}>
        {props.children}
      </CallToActionInner>
    </CallToActionButton>
  ),
  { displayName: 'CallToAction' }
)(callToActionStyle)

export const CallToActionLink = glamorous(
  props => (
    <CallToActionLinkComp {...props}>
      <CallToActionInner loading={props.loading}>
        {props.children}
      </CallToActionInner>
    </CallToActionLinkComp>
  ),
  { displayName: 'CallToActionLink' }
)(callToActionStyle)

export const Submit = glamorous(
  props => (
    <CallToActionButton type="submit" {...props}>
      <Hidden>{props.children}</Hidden>
      <CallToActionIcon loading={props.loading} />
    </CallToActionButton>
  ),
  { displayName: 'Submit' }
)(callToActionStyle, borderRadiusOnlyRight, {
  paddingLeft: '0.3em',
  paddingRight: '0.6em',
})
