import React from 'react'
import glamorous from 'glamorous'
import { getCounterStyle } from './counterStyle'
import { violet, wit } from '../colors'
import { square } from '../helpers/styleHelpers'
import { resetMarginStyle } from '../marginStyle'
import { css } from 'glamor'
import { withProps, nest, branch, renderNothing } from 'recompose'
import { borderRadius, fadeInAnimation } from '../styles'
import { mqSmall, mqBig } from '../config'
import { unexisting } from '../helpers/helpers'

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
          marginBottom: top,
        }
      : null,
    ':after': bottom
      ? {
          content: '""',
          display: 'block',
          paddingBottom: '1px',
          marginTop: bottom,
        }
      : null,
  })
)

const counterSize = '1.6em'

const commonStepStyle = css({
  borderBottom: `2px solid ${wit}`,
  padding: '0 1rem 0 3.2rem',
  position: 'relative',
  animation: fadeInAnimation,

  [mqSmall]: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  [mqBig]: {
    paddingRight: '2rem',
  },
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

const StepInsideMargin = withProps({ top: '0.5rem', bottom: '1rem' })(
  InsideMargin
)

export const Step = nest(StepComp, StepInsideMargin)

export const StepTitle = glamorous.h2(resetMarginStyle, {
  lineHeight: 1.15,
  fontSize: '1.3rem',
  padding: '0.2rem 0',
  marginBottom: '0.8rem',
})

export const Sticky = glamorous.div({
  position: 'sticky',
  top: 0,
  backgroundColor: violet.lightest,
  zIndex: 2,
})

export const Paragraph = glamorous.p({
  margin: 0,
})

export const FormRow = glamorous.div({
  margin: '0 0 1rem 0',
})

const MessageComp = glamorous.section(commonStepStyle, {
  backgroundColor: violet.default,
  color: wit,
  ':before': css(commonStepIconStyle, {
    content: '"✔"',
    color: violet.default,
    backgroundColor: wit,
  }),
})

export const Message = nest(MessageComp, StepInsideMargin)

const stripeWidth = 6

export const ErrorMessageComp = glamorous.section(commonStepStyle, {
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
    backgroundImage: `repeating-linear-gradient(-45deg, ${violet.lightest}, ${violet.lightest} ${stripeWidth}px, ${violet.default} ${stripeWidth}px, ${violet.default} ${stripeWidth *
      2 +
      1}px)`,
  }),
})

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

export const GroupLabel = glamorous.div(
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

export const Input = glamorous.input(borderRadius, {
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

const AliasStyled = glamorous.span({
  fontSize: '0.8rem',
  display: 'block',
})

const AliasComp = ({ children }) => {
  return <AliasStyled>Alias: ‘{children}’</AliasStyled>
}

export const Alias = branch(
  ({ children }) => unexisting(children),
  renderNothing
)(AliasComp)

export const NumberInput = withProps({
  type: 'number',
  css: css({
    width: '4rem',
    textAlign: 'right',
  }),
})(Input)

const RadioComp = glamorous.span({
  display: 'inline-block',
  verticalAlign: 'top',
  margin: '0.5rem 0.3rem 0 0',
  position: 'relative',
})

const SingleRadioComp = glamorous.span({
  display: 'inline-block',
  verticalAlign: 'top',
  margin: '0 0.3rem 0.5rem 0',
  position: 'relative',
})

const RadioInput = glamorous.input(hiddenStyle, {
  ':focus + label': {
    textDecoration: 'underline',
  },
})

const RadioLabel = glamorous.label(
  borderRadius,
  {
    color: wit,
    lineHeight: 1.2,
    cursor: 'pointer',
    display: 'inline-block',
    padding: '0.2em 0.6em 0.2em 1.4em',
    position: 'relative',
    ':before': {
      content: '""',
      left: '0.55em',
      top: '0.55em',
      position: 'absolute',
      ...square('0.4em'),
      borderRadius: '9999px',
    },
  },
  ({ checked }) => {
    const backgroundColor = checked ? violet.darker : violet.default

    return {
      backgroundColor,
      ':before': {
        boxShadow: `0 0 0 2px ${backgroundColor}, 0 0 0 3px ${wit}`,
        backgroundColor: checked ? wit : 'transparent',
      },
    }
  }
)

const CheckboxLabel = glamorous.label(
  borderRadius,
  {
    color: wit,
    lineHeight: 1.2,
    cursor: 'pointer',
    display: 'inline-block',
    padding: '0.2em 0.6em 0.2em 1.4em',
    position: 'relative',
    ':before': {
      content: '""',
      left: '0.6em',
      top: '0.6em',
      position: 'absolute',
      ...square('0.3em'),
    },
  },
  ({ checked, differentSelectionGroup }) => {
    const backgroundColor = differentSelectionGroup
      ? violet.light
      : checked ? violet.darker : violet.default
    const color = differentSelectionGroup ? violet.darker : wit

    return {
      backgroundColor,
      color,
      ':before': {
        boxShadow: `0 0 0 2px ${backgroundColor}, 0 0 0 3px ${color}`,
        backgroundColor: checked ? color : 'transparent',
      },
    }
  }
)

const SingleCheckboxLabel = glamorous.label(
  borderRadius,
  {
    color: violet.darker,
    lineHeight: 1.2,
    cursor: 'pointer',
    display: 'inline-block',
    padding: '0.2em 0.6em 0.2em 0.8em',
    position: 'relative',
    ':before': {
      content: '""',
      left: 0,
      top: '0.6em',
      position: 'absolute',
      ...square('0.3em'),
    },
  },
  ({ checked }) => {
    return {
      ':before': {
        boxShadow: `0 0 0 2px ${violet.lightest}, 0 0 0 3px ${violet.darker}`,
        backgroundColor: checked ? violet.darker : 'transparent',
      },
    }
  }
)
export const Radio = ({
  children,
  name,
  id = name,
  value = '',
  onChange,
  checked,
  differentSelectionGroup,
}) => (
  <RadioComp>
    <RadioInput
      type="radio"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    <RadioLabel
      htmlFor={id}
      checked={checked}
      differentSelectionGroup={differentSelectionGroup}
    >
      {children}
    </RadioLabel>
  </RadioComp>
)

export const Checkbox = ({
  children,
  name,
  id = name,
  value = '',
  onChange,
  checked,
  differentSelectionGroup,
}) => (
  <RadioComp>
    <RadioInput
      type="checkbox"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    <CheckboxLabel
      htmlFor={id}
      checked={checked}
      differentSelectionGroup={differentSelectionGroup}
    >
      {children}
    </CheckboxLabel>
  </RadioComp>
)

export const SingleCheckbox = ({
  children,
  name,
  id = name,
  value = '',
  onChange,
  checked,
}) => (
  <SingleRadioComp>
    <RadioInput
      type="checkbox"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    <SingleCheckboxLabel htmlFor={id} checked={checked}>
      {children}
    </SingleCheckboxLabel>
  </SingleRadioComp>
)

export const AccordionButton = glamorous.button(
  {
    border: 'none',
    display: 'block',
    background: 'none',
    color: 'inherit',
    padding: 0,
    cursor: 'pointer',
  },
  ({ opened, includesSelection }) => ({
    fontWeight: 'inherit',
    ':after': {
      content: opened ? '"×"' : '"+"',
      display: 'inline-block',
      marginLeft: '0.3rem',
      fontWeight: 'normal',
      borderRadius: '999px',
      textAlign: 'center',
      width: '1rem',
      height: '1rem',
      lineHeight: 1.3,
      boxShadow: `0 0 0 1px ${violet.darker}`,
      ...(includesSelection
        ? {
            color: wit,
            backgroundColor: violet.darker,
          }
        : {
            color: violet.darker,
            backgroundColor: wit,
          }),
    },
  })
)

export const CloseAccordion = glamorous.button({
  border: 'none',
  display: 'block',
  background: 'none',
  color: violet.darker,
  padding: 0,
  fontSize: '0.8rem',
  cursor: 'pointer',
  animation: fadeInAnimation,

  ':after': {
    content: '"×"',
    display: 'inline-block',
    marginLeft: '0.3rem',
    fontWeight: 'normal',
    lineHeight: '0.8rem',
    fontSize: '1.1rem',
  },
})

export const Center = glamorous.div({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
})

export const AlignRight = glamorous.div({
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
})
export const CoverPage = glamorous.div({
  position: 'absolute',
  height: '100%',
  width: '100%',
})
