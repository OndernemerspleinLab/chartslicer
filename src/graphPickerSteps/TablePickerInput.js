import { pure, compose, withHandlers, withState } from 'recompose'
import React from 'react'
import { Label, Input } from './Elements'
import { Submit } from '../CallToAction'
import { Media, MediaText, MediaFigure } from '../Media'
import { marginBottomHalfStyle } from '../marginStyle'
import { afterPaste } from '../domHelpers'
import { borderRadiusOnlyLeft } from '../styles'
import { connectActions } from '../store'
import {
  connectDatasetsNetworkState,
  connectActiveDatasetsNetworkState,
} from '../reducers/networkStateReducer'

const enhancer = compose(
  pure,
  connectActions,
  connectDatasetsNetworkState,
  connectActiveDatasetsNetworkState('loading'),
  withState('value', 'updateValue', ''),
  withHandlers({
    onChange: ({ updateValue }) => event =>
      updateValue(event.currentTarget.value),
    onSubmit: ({
      tableSelectionChanged,
      datasetsNetworkState,
      value,
    }) => event => {
      event.preventDefault()
      tableSelectionChanged({ input: value, datasetsNetworkState })
    },
    onPaste: ({ tableSelectionChanged, datasetsNetworkState }) =>
      afterPaste(event => {
        tableSelectionChanged({
          input: event.currentTarget.value,
          datasetsNetworkState,
        })
      }),
  })
)
export const TablePickerInput = enhancer(
  ({ onChange, onSubmit, onPaste, tableUrl, updateValue, loading }) => (
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
          />
        </MediaText>
        <MediaFigure>
          <Submit loading={loading}>{'Kies'}</Submit>
        </MediaFigure>
      </Media>
    </form>
  )
)
