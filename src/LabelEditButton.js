import React from 'react'
import { Pencil } from './svg/Pencil'
import glamorous from 'glamorous'
import { Hidden } from './graphPickerSteps/Elements'
import { wit } from './colors'
import { withStateHandlers } from 'recompose'
import { LabelEditor } from './LabelEditor'

const EditButton = glamorous.button({
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: wit,
  fill: 'currentColor',
})

const Wrapper = ({ children }) => children

const LabelEditButtonElement = ({
  children,
  dimensionType,
  info,
  alias,
  editorOpened,
  activeDatasetId,
  toggle,
  close,
  index,
}) => {
  return (
    <Wrapper>
      <EditButton title={children} onClick={toggle}>
        <Hidden>{children}</Hidden>
        <Pencil />
      </EditButton>
      {editorOpened ? (
        <LabelEditor
          info={info}
          dimensionType={dimensionType}
          alias={alias}
          activeDatasetId={activeDatasetId}
          close={close}
          index={index}
        />
      ) : null}
    </Wrapper>
  )
}

export const LabelEditButton = withStateHandlers(
  { editorOpened: false },
  {
    open: () => () => ({ editorOpened: true }),
    close: () => () => ({ editorOpened: false }),
    toggle: ({ editorOpened }) => () => ({ editorOpened: !editorOpened }),
  }
)(LabelEditButtonElement)
