import { hemelblauw } from './colors'
import { Center, CoverPage } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import React from 'react'
import { canPersist, isWritable } from './store/persistTridion'
import {
  compose,
  withState,
  branch,
  lifecycle,
  renderComponent,
  nest,
} from 'recompose'
import glamorous from 'glamorous'

const delay = 600

const NotWritableElement = nest(
  CoverPage,
  Center,
  glamorous.h1({
    animation: fadeInAnimation,
    color: hemelblauw.default,
    fontSize: '2.6rem',
    margin: 0,
    padding: '3rem',
    textAlign: 'center',
  })
)
const NotWritable = () =>
  <NotWritableElement>
    Het Tridion component kan niet worden aangepast. Mogelijk is het niet
    uitgecheckt.
  </NotWritableElement>

const guardWritableEnhancer = compose(
  withState('writable', 'setWritable', true),
  lifecycle({
    updateWritable() {
      const nextWritable = isWritable()
      if (this.props.writable !== nextWritable) {
        this.props.setWritable(nextWritable)
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(this.updateWritable, delay)
    },
    componentDidMount() {
      this.updateWritable = this.updateWritable.bind(this)
      this.updateWritable()
    },
    componentWillUnmount() {
      clearTimeout(this.timer)
    },
  }),
  branch(({ writable }) => !writable, renderComponent(NotWritable))
)

export const writableEnhancer = branch(canPersist, guardWritableEnhancer)
