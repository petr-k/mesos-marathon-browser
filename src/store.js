// @flow
import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import reduxThunk from 'redux-thunk'
import * as ApplicationList from './ApplicationList/reducer'
import type { State as ApplicationListState } from './ApplicationList/reducer'

export type RootState = {
  applicationList: ApplicationListState,
}

const initialState: RootState = {
  applicationList: ApplicationList.initialState,
}

const reducers = {
  applicationList: ApplicationList.default,
}

const middlewares = applyMiddleware(reduxThunk)

const allMiddlewares = window.devToolsExtension
  ? compose(middlewares, window.devToolsExtension())
  : middlewares

const store = createStore(
  combineReducers(reducers),
  initialState,
  allMiddlewares,
)

createStore(middlewares)

export default store
