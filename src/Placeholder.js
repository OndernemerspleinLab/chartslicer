import React from 'react'
import glamorous from 'glamorous'
import { onlyWhenNotLoaded } from './higherOrderComponents'
// Source of image: https://commons.wikimedia.org/wiki/File:George_Bernard_Shaw_1925.jpg
import imageSrc from './George_Bernard_Shaw_1925.jpg'
import Color from 'color'
import { hemelblauw } from './colors'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'
import { compose } from 'recompose'
import { css } from 'glamor'

const imageWidth = 7
const imageAspectRatio = 280 / 396
const imageHeight = imageWidth / imageAspectRatio
const imageAltText = 'George Bernard Shaw'
const quote =
  'It is the mark of a truly intelligent person to be moved by statistics.'
const source = 'George Bernard Shaw'

const Center = glamorous.div({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
})

const PlaceholderComp = glamorous.div({
  fontFamily: 'georgia, serif',
  maxWidth: '30rem',
  padding: '3rem',
  color: 'hsl(207, 13%, 37%)',
  marginBottom: '10%',
})
const BlockQuote = glamorous.blockquote({
  padding: 0,
  margin: 0,
})

const Quote = glamorous.p({
  fontStyle: 'italic',
  fontSize: '1.5rem',
  margin: '1rem 0 0.7rem 0',
})
const Source = glamorous.footer({
  marginTop: '0.7rem',
})

const pulseKeyframes = css.keyframes({
  '0% 50%': {
    transform: 'scale(1)',
  },
  '25%': {
    transform: 'scale(1.1)',
  },
  '75%': {
    transform: 'scale(0.9)',
  },
})

const pulseAnimation = `1200ms linear infinite ${pulseKeyframes}`

const FigureComp = glamorous.figure(
  {
    display: 'block',
    width: `${imageWidth}rem`,
    height: `${imageHeight}rem`,
    margin: '0 auto 1rem auto',
    position: 'relative',
    ':after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: 0,
      top: 0,
      right: 0,
      backgroundImage: `radial-gradient(closest-side, ${Color(hemelblauw.lighter).alpha(0.3)}, ${hemelblauw.lighter})`,
    },
  },
  ({ loading }) =>
    loading
      ? {
          animation: pulseAnimation,
        }
      : null
)

const Figure = connectActiveDatasetsNetworkState('loading')(FigureComp)

const Image = glamorous.img({
  display: 'block',
  width: `${imageWidth}rem`,
  height: `${imageHeight}rem`,
})

const PlaceholderContainer = () => (
  <Center>
    <PlaceholderComp>
      <Figure>
        <Image src={imageSrc} alt={imageAltText} />
      </Figure>
      <BlockQuote>
        <Quote>“{quote}”</Quote>
        <Source>— {source}</Source>
      </BlockQuote>
    </PlaceholderComp>
  </Center>
)

export const Placeholder = compose(onlyWhenNotLoaded)(PlaceholderContainer)
