// @flow
import type { AppDefinition } from './../marathon'
import type { Action } from './actions'
import appMatcher from './appMatcher'

export type App = {
  +definition: AppDefinition,
}

export type State = {
  +apps: {
    [id: string]: App,
  },
  +visibleApps: App[],
  +isLoading: boolean,
  +loadError: ?string,
  +filterText: string,
}

export const initialState: State = {
  apps: {},
  visibleApps: [],
  isLoading: false,
  loadError: null,
  filterText: '',
}

function visibleApps(state: State, apps: {[id: string]: App} = state.apps, filter: string = state.filterText): App[] {
  const appList = Object.keys(apps).map(id => apps[id])
  return appMatcher(appList, filter)
}

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'LoadApplications': {
      const apps = action.response.apps.reduce((o, p) => {
        const appObj = o[p.id]
        o[p.id] = { // eslint-disable-line no-param-reassign
          ...appObj || {},
          definition: p,
        }
        return o
      }, {})

      return {
        ...state,
        isLoading: false,
        apps,
        visibleApps: visibleApps(state, apps),
      }
    }
    case 'LoadApplicationsStarted':
      return {
        ...state,
        isLoading: true,
      }
    case 'LoadApplicationsFailed': {
      return {
        ...state,
        isLoading: false,
        loadError: action.error,
      }
    }
    case 'SetFilterText':
      return {
        ...state,
        filterText: action.text,
        visibleApps: visibleApps(state, state.apps, action.text),
      }
    default:
      (action: empty)
      return state
  }
}
