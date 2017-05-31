import React from 'react'
import glamorous from 'glamorous'
import { getCounterStyle } from './counterStyle'
import { violet, wit } from '../colors'
import { square } from '../styleHelpers'
import { resetMarginStyle, marginBottomStyle } from '../marginStyle'
import { css } from 'glamor'
import { withProps, nest } from 'recompose'

const hiddenStyle = {
  position: 'absolute',
  left: '-999em',
  top: '0',
  height: '1px',
  overflow: 'hidden',
}

export const Hidden = glamorous.span(hiddenStyle)

export const InsideMargin = glamorous.div(
  ({ size, bottom = size, top = size }) => ({
    ':before': top
      ? {
          content: '""',
          display: 'block',
          paddingTop: '1px',
          marginTop: '-1px',
          marginBottom: top,
        }
      : null,
    ':after': bottom
      ? {
          content: '""',
          display: 'block',
          paddingBottom: '1px',
          marginBottom: '-1px',
          marginTop: bottom,
        }
      : null,
  })
)

const counterSize = '1.6em'

const commonStepStyle = css({
  marginBottom: '2px',
  padding: '0 1rem 0 3.2rem',
  position: 'relative',
})
const commonStepIconStyle = css(square(counterSize), {
  display: 'block',
  position: 'absolute',
  left: '0.9rem',
  top: '0.7rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  lineHeight: counterSize,
  borderRadius: '999px',
})

const StepComp = glamorous.section(
  commonStepStyle,
  {
    backgroundColor: violet.lightest,
    color: violet.default,
  },
  getCounterStyle(commonStepIconStyle, {
    color: wit,
    backgroundColor: violet.default,
  })
)

const StepInsideMargin = withProps({ top: '0.7rem', bottom: '1rem' })(
  InsideMargin
)

export const Step = nest(StepComp, StepInsideMargin)

export const StepTitle = glamorous.h2(
  {
    lineHeight: 1.15,
    fontSize: '1.3rem',
  },
  resetMarginStyle,
  marginBottomStyle
)

export const Paragraph = glamorous.p({
  margin: 0,
})

export const FormRow = glamorous.p({
  margin: '0 0 1rem 0',
})

const arrowThickness = 8

const arrowUpStyle = css({
  ':after': {
    content: '""',
    border: `${arrowThickness}px solid transparent`,
    borderBottomColor: violet.default,
    position: 'absolute',
    left: '50%',
    marginLeft: -arrowThickness,
    bottom: '100%',
  },
})
const MessageComp = glamorous.section(
  commonStepStyle,
  {
    backgroundColor: violet.default,
    color: wit,
    ':before': css(commonStepIconStyle, {
      content: '"✔"',
      color: violet.default,
      backgroundColor: wit,
    }),
  },
  arrowUpStyle
)

export const Message = nest(MessageComp, StepInsideMargin)

const stripeWidth = 6

export const ErrorMessageComp = glamorous.section(
  commonStepStyle,
  {
    backgroundColor: violet.default,
    color: wit,
    ':before': css({
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: violet.lightest,
      width: '2.5rem',
      backgroundImage: `repeating-linear-gradient(-45deg, ${violet.lightest}, ${violet.lightest} ${stripeWidth}px, ${violet.default} ${stripeWidth}px, ${violet.default} ${stripeWidth * 2 + 1}px)`,
    }),
  },
  arrowUpStyle
)

export const ErrorMessage = nest(ErrorMessageComp, StepInsideMargin)

const labelStyle = css({
  fontWeight: 'bold',
  lineHeight: 1.15,
  fontSize: '0.8rem',
})

export const Label = glamorous.label(
  {
    display: 'block',
  },
  labelStyle
)

export const InputQuantifier = glamorous.label({
  lineHeight: 1.15,
  marginLeft: '0.5em',
})

export const InlineTerm = glamorous.span(labelStyle)

export const Form = withProps({
  onSubmit: event => event.preventDefault(),
})(glamorous.form())

export const Input = glamorous.input({
  display: 'block',
  border: `1px solid ${violet.default}`,
  padding: '0.5em 0.3em',
  color: violet.default,
  backgroundColor: wit,
  width: '100%',
  '::placeholder': {
    color: violet.light,
  },
})

export const NumberInput = withProps({
  type: 'number',
  css: css({
    width: '4rem',
    textAlign: 'right',
  }),
})(Input)

const RadioComp = glamorous.span({
  display: 'inline-block',
  margin: '0.5rem 0.3rem 0 0',
})
const RadioInput = withProps({ type: 'radio' })(
  glamorous.input(
    {
      '&:checked + label:before': {
        backgroundColor: wit,
      },
    },
    hiddenStyle
  )
)
const RadioLabel = glamorous.label({
  color: wit,
  backgroundColor: violet.default,
  lineHeight: 1.2,
  display: 'inline-block',
  borderRadius: '2px',
  padding: '0.2em 0.6em 0.2em 1.4em',
  position: 'relative',
  ':before': {
    content: '""',
    left: '0.55em',
    top: '0.55em',
    position: 'absolute',
    ...square('0.4em'),
    borderRadius: '9999px',
    boxShadow: `0 0 0 2px ${violet.default}, 0 0 0 3px ${wit}`,
  },
})

export const Radio = ({
  children,
  name,
  id = name,
  value = '',
  onChange,
  checked,
}) => (
  <RadioComp>
    <RadioInput
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    <RadioLabel htmlFor={id}>{children}</RadioLabel>
  </RadioComp>
)
