import { Pencil } from './svg/Pencil'
import { connect } from 'react-redux'
import { configGetConnector } from './connectors/configConnectors'
import { configChangeEnhancer } from './enhancers/configEnhancers'
import { SeamlessTextarea } from './SeamlessTextarea'
import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { InsideMargin, Hidden } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'

const enhancer = compose(onlyWhenVisibleDataset)

const DataInfoComp = glamorous.div({
  backgroundColor: hemelblauw.lighter,
  animation: fadeInAnimation,
  maxWidth: '60rem',
})

const TitleComp = glamorous.h1({
  color: hemelblauw.default,
  fontSize: '2.2rem',
  lineHeight: '1.2',
  margin: '0 0 1rem 0',
  position: 'relative',
})

const Description = glamorous.p({
  position: 'relative',
})

const TextAreaLabelElement = glamorous.label({
  position: 'absolute',
  top: '0.3em',
  bottom: '0.3em',
  right: '100%',
  paddingRight: '0.8rem',
})

const TextareaLabel = ({ children, htmlFor }) => (
  <TextAreaLabelElement htmlFor={htmlFor}>
    <Hidden>{children}</Hidden>
    <Pencil fill={hemelblauw.darker} opacity={0.3} />
  </TextAreaLabelElement>
)

const TitleTextarea = compose(
  connect(state => {
    return {
      keyPath: ['title'],
      value: configGetConnector('title')(state),
    }
  }),
  configChangeEnhancer
)(SeamlessTextarea)

const DescriptionTextarea = compose(
  connect(state => {
    return {
      keyPath: ['description'],
      value: configGetConnector('description')(state),
    }
  }),
  configChangeEnhancer
)(SeamlessTextarea)

const DataInfoContainer = () => (
  <DataInfoComp>
    <InsideMargin top="1.4rem" bottom="2rem">
      <TitleComp>
        <TextareaLabel htmlFor="titleInput">Titel</TextareaLabel>
        <TitleTextarea id="titleInput" placeholder="Kies een titel…" />
      </TitleComp>
      <Description>
        <TextareaLabel htmlFor="descriptionInput">beschrijving</TextareaLabel>
        <DescriptionTextarea
          id="descriptionInput"
          placeholder="Kies een beschrijving…"
        />
      </Description>
    </InsideMargin>
  </DataInfoComp>
)

export const DataInfo = enhancer(DataInfoContainer)
