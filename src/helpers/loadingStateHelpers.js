import { get } from '../helpers/getset'

export const shouldFetch = loadingState =>
  !get('loaded')(loadingState) && !get('loading')(loadingState)
