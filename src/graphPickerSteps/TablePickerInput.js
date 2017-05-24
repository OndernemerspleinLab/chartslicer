import { pure, compose, withHandlers, withState } from 'recompose'
import React from 'react'
import { Label, Input } from './Elements'
import { Submit } from '../CallToAction'
import { Media, MediaText, MediaFigure } from '../Media'
import { marginBottomHalfStyle } from '../marginStyle'
import { afterPaste } from '../domHelpers'
import { borderRadiusOnlyLeft } from '../styles'
import { connectActions } from '../store'

const enhancer = compose(
  pure,
  connectActions,
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: ({ updateValue }) => event =>
      updateValue(event.currentTarget.value),
    onSubmit: ({ tableSelectionChanged, value }) => event => {
      event.preventDefault()
      tableSelectionChanged(value)
    },
    onPaste: ({ tableSelectionChanged }) =>
      afterPaste(event => {
        tableSelectionChanged(event.currentTarget.value)
      }),
  })
)
export const TablePickerInput = enhancer(
  ({ onChange, onSubmit, onPaste, tableUrl, updateValue }) => (
    <form onSubmit={onSubmit}>
      <Label htmlFor="tableIdInput" css={marginBottomHalfStyle}>
        Dataset URL of ID
      </Label>
      <Media>
        <MediaText>
          <Input
            type="text"
            value={tableUrl}
            id="tableIdInput"
            css={borderRadiusOnlyLeft}
            onPaste={onPaste}
            onChange={onChange}
            placeholder="bijv. ‘https://opendata.cbs.nl/#/CBS/nl/dataset/82439NED/line?graphtype=Line’ of ‘81573NED’"
          />
        </MediaText>
        <MediaFigure>
          <Submit>{'Kies'}</Submit>
        </MediaFigure>
      </Media>
    </form>
  )
)
