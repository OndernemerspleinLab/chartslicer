import { getTableInfoUrl } from './config'
import got from 'got'

export const tableIdChanged = id => dispatch => {
  got(getTableInfoUrl(id), { json: true }).then(r => console.log(r.body))
}

tableIdChanged('82616NED')()
