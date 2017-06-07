import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/actionCreators'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export const connectActions = connect(null, mapDispatchToProps)
