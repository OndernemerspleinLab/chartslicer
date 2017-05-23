import glamorous from 'glamorous'
import { getCounterStyle } from './counterStyle'
import { violet, wit } from '../colors'
import { square } from '../styleHelpers'
import { resetMarginStyle, marginBottomStyle } from '../marginStyle'

const counterSize = '1.6em'

export const Step = glamorous.div(
  {
    backgroundColor: violet.lightest,
    marginBottom: '2px',
    padding: '0.5rem 1rem 1rem 3.2rem',
    position: 'relative',
  },
  getCounterStyle(
    {
      display: 'block',
      position: 'absolute',
      left: '0.9rem',
      top: '0.7rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      lineHeight: counterSize,
      color: wit,
      backgroundColor: violet.default,
      borderRadius: '999px',
    },
    square(counterSize)
  )
)

export const StepTitle = glamorous.h2(
  {
    color: violet.default,
    lineHeight: 1.15,
  },
  resetMarginStyle,
  marginBottomStyle
)

export const Label = glamorous.label({
  display: 'block',
  color: violet.default,
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
