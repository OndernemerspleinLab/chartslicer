import React from 'react'
import glamorous from 'glamorous'
import { violet, hemelblauw } from './colors'
import { Hidden } from './graphPickerSteps/Elements'
import Color from 'color'
import { css } from 'glamor'

const sizeInRem = 2

const sizeString = `${sizeInRem}rem`

const fadeInLoadingKeyframes = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const LoadingElement = glamorous.div({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  borderRadius: '2px',
  backgroundColor: Color(hemelblauw.lighter).alpha(0.8).string(),
  zIndex: 5,
  opacity: 0,
  animation: `${fadeInLoadingKeyframes} 200ms ease-in-out 200ms forwards`,
})

const LoadingSvg = glamorous.svg({
  width: sizeString,
  height: sizeString,
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginTop: `${sizeInRem / -2}rem`,
  marginLeft: `${sizeInRem / -2}rem`,
})

export const Loading = () =>
  <LoadingElement>
    <Hidden>Data wordt geladen</Hidden>
    <LoadingSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <path
        d="M0 50A50 50 0 0 1 50 0L50 50L0 50"
        fill={violet.default}
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="0.75s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M50 0A50 50 0 0 1 100 50L50 50L50 0"
        fill={violet.lightest}
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M100 50A50 50 0 0 1 50 100L50 50L100 50"
        fill={hemelblauw.default}
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M50 100A50 50 0 0 1 0 50L50 50L50 100"
        fill={hemelblauw.lighter}
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </LoadingSvg>
  </LoadingElement>
