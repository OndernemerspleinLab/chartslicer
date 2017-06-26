import { update } from '../helpers/getset'
import type { State } from '../store/stateShape'
import type { Action } from '../actions/actionTypes'

export type Reducer = (State, Action) => State

export const composeReducers = (...reducers) =>
  reducers.length === 0
    ? state => state
    : reducers.reduce((a, b) => (state, action) => a(b(state, action), action))

const reduceWith = (reducer, action) => state => reducer(state, action)

export const reduceIn = (...keyPath) => reducer => (state, action) =>
  update(keyPath, reduceWith(reducer, action))(state)

export const reduceFor = type => reducer => (state, action) =>
  action.type === type ? reducer(state, action) : state

export const reduceWhen = predicate => reducer => (state, action) =>
  predicate(state, action) ? reducer(state, action) : state

export const defaultState = defaultState => reducer => (
  state = defaultState,
  action
) => reducer(state, action)
