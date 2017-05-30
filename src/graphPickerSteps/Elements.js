import glamorous from 'glamorous'
import { getCounterStyle } from './counterStyle'
import { violet, wit } from '../colors'
import { square } from '../styleHelpers'
import { resetMarginStyle, marginBottomStyle } from '../marginStyle'
import { css } from 'glamor'

const counterSize = '1.6em'

const commonStepStyle = css({
  marginBottom: '2px',
  padding: '0.5rem 1rem 1rem 3.2rem',
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

export const Step = glamorous.section(
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

export const StepTitle = glamorous.h2(
  {
    lineHeight: 1.15,
  },
  resetMarginStyle,
  marginBottomStyle
)

export const Paragraph = glamorous.p({
  margin: 0,
})

export const Message = glamorous.section(commonStepStyle, {
  backgroundColor: violet.default,
  color: wit,
  ':before': css(commonStepIconStyle, {
    content: '"✔"',
    color: violet.default,
    backgroundColor: wit,
  }),
})

const stripeWidth = 6

export const ErrorMessage = glamorous.section(commonStepStyle, {
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
})

export const Label = glamorous.label({
  display: 'block',
  fontWeight: 'bold',
  // textTransform: 'uppercase',
  lineHeight: 1.15,
  fontSize: '0.8rem',
})

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

export const Hidden = glamorous.span({
  position: 'absolute',
  left: '-999em',
  top: '0',
  height: '1px',
  overflow: 'hidden',
})
