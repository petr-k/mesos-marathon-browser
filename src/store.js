// @flow
import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import reduxThunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import * as ApplicationList from './ApplicationList/reducer'
import type { State as ApplicationListState } from './ApplicationList/reducer'
import appListSaga from './ApplicationList/saga'

export type RootState = {
  applicationList: ApplicationListState,
}

const initialState: RootState = {
  applicationList: ApplicationList.initialState,
}

const reducers = {
  applicationList: ApplicationList.default,
}

const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(reduxThunk, sagaMiddleware)

const allMiddlewares = window.devToolsExtension
  ? compose(middlewares, window.devToolsExtension())
  : middlewares

const store = createStore(
  combineReducers(reducers),
  initialState,
  allMiddlewares,
)

sagaMiddleware.run(appListSaga)

createStore(middlewares)

export default store
