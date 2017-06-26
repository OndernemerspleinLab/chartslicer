import { update, merge } from '../helpers/getset'

export const invalidIdError = new Error('Invalid dataset ID')

export const getLoadingState = () => ({
  loading: true,
  error: null,
  loaded: false,
})
export const getLoadSuccessState = () => ({
  loading: false,
  error: null,
  loaded: true,
})
export const getLoadErrorState = (error = true) => ({
  loading: false,
  error,
  loaded: false,
})

export const getInvalidIdState = () => getLoadErrorState(invalidIdError)

export const loadingReducer = (state = {}, { id }) =>
  update(id, merge({ id }, getLoadingState()))(state)

export const loadSuccessReducer = (state = {}, { id }) =>
  update(id, merge({ id }, getLoadSuccessState()))(state)

export const loadErrorReducer = (state = {}, { id, error }) =>
  update(id, merge({ id }, getLoadErrorState(error)))(state)

export const invalidIdReducer = (state = {}, { input }) =>
  update(input, merge({ id: input }, getInvalidIdState()))(state)
