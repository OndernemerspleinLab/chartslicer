import glamorous from 'glamorous'
import { counterStyle } from './counterStyle'

export const Step = glamorous.div(counterStyle)

export const StepTitle = glamorous.h2()

export const CallToAction = glamorous.a({
  background: 'none',
  border: 'none',
  textDecoration: 'none',
})
