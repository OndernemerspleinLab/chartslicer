import React from 'react'
import glamorous from 'glamorous'
import { Modal } from './Modal'
import {
  withProps,
  withStateHandlers,
  compose,
  withHandlers,
  nest,
} from 'recompose'
import { connectActions } from './connectors/actionConnectors'
import { violet } from './colors'
import { borderRadius, borderRadiusOnlyLeft } from './styles'
import { Label, Input, Hidden, AlignRight } from './graphPickerSteps/Elements'
import { css } from 'glamor'
import { Submit } from './CallToAction'
import { Media, MediaText, MediaFigure } from './Media'
import { autofocusEnhancer } from './enhancers/autofocusEnhancer'

const Form = glamorous.form(borderRadius, {
  position: 'relative',
  backgroundColor: violet.lightest,
  color: violet.default,
  border: `2px solid ${violet.default}`,
  width: '30rem',
  maxWidth: '90vw',
  flex: 'none',
  padding: '0.8rem 1rem 0.5rem 1rem',
})

const LabelAliasInput = withProps({
  type: 'text',
  css: css(borderRadiusOnlyLeft),
})(autofocusEnhancer(Input))

const LabelAliasLabel = withProps({
  css: css({
    marginBottom: '0.8rem',
    paddingRight: '1rem',
  }),
})(Label)

const CloseButtonElement = glamorous.button({
  position: 'absolute',
  border: 'none',
  background: 'none',
  padding: 0,
  borderRadius: 0,
  top: '0.4rem',
  right: '0.4rem',
  fontSize: '1.8rem',
  color: violet.darker,
  width: '1em',
  height: '1em',

  ':after': {
    content: '"×"',
    display: 'block',
    width: '100%',
    height: '100%',
    fontWeight: 'normal',
    lineHeight: '1em',
    fontSize: '1em',
  },
})
const CloseButton = nest(
  withProps({ type: 'button' })(CloseButtonElement),
  Hidden
)
const ResetButtonElement = glamorous.button({
  border: 'none',
  background: 'none',
  padding: 0,
  borderRadius: 0,
  color: 'inherit',
  textDecoration: 'underline',
  fontSize: '0.8rem',
  marginTop: '0.5rem',
})
const ResetButton = withProps({ type: 'button' })(ResetButtonElement)

const LabelEditorElement = ({
  info: { title },
  value,
  close,
  setValue,
  onSubmit,
  onReset,
  index,
  refInputDomElement,
}) => {
  const id = `labelAliasInput${index}`
  return (
    <Modal>
      <Form onSubmit={onSubmit}>
        <LabelAliasLabel htmlFor={id}>
          Overschrijf label voor ‘{title}’
        </LabelAliasLabel>

        <Media>
          <MediaText>
            <LabelAliasInput
              id={id}
              value={value}
              onChange={setValue}
              innerRef={refInputDomElement}
            />
          </MediaText>
          <MediaFigure>
            <Submit>Opslaan</Submit>
          </MediaFigure>
        </Media>
        <AlignRight>
          <ResetButton onClick={onReset}>Verwijderen</ResetButton>
        </AlignRight>
        <CloseButton onClick={close}>Sluiten</CloseButton>
      </Form>
    </Modal>
  )
}

export const LabelEditor = compose(
  connectActions,
  withStateHandlers(({ alias }) => ({ value: alias || '' }), {
    setValue: () => event => ({ value: event.target.value }),
    refInputDomElement: () => inputDomElement => ({ inputDomElement }),
  }),
  withHandlers({
    onReset: ({
      labelAliasChanged,
      info: { key, dimensionKey },
      dimensionType,
      close,
      activeDatasetId,
    }) => event => {
      event.preventDefault()
      labelAliasChanged({
        activeDatasetId,
        value: undefined,
        key,
        dimensionKey,
        aliasType: dimensionType,
      })
      close()
    },
    onSubmit: ({
      labelAliasChanged,
      value,
      info: { key, dimensionKey },
      dimensionType,
      close,
      activeDatasetId,
    }) => event => {
      event.preventDefault()
      labelAliasChanged({
        activeDatasetId,
        value,
        key,
        dimensionKey,
        aliasType: dimensionType,
      })
      close()
    },
  })
)(LabelEditorElement)
