// @flow
import { mapValues, includes } from 'lodash'
import type { AppDefinition } from './../api'
import type { Action } from './actions'
import appMatcher from './appMatcher'

export type App = {
  +definition: AppDefinition,
  +imageMetadata: ImageMetadata,
}

export type ImageMetadata = {
  +labels: ImageLabels,
  +isLoading: ?boolean,
  loaded: ?boolean,
}

type AppsById = {
  [id: string]: App,
}

export type ImageLabels = {
  [name: string]: string,
}

export type State = {
  +apps: AppsById,
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

function visibleApps(state: State, apps: AppsById = state.apps, filter: string = state.filterText): App[] {
  const appList = Object.keys(apps).map(id => apps[id])
  return appMatcher(appList, filter)
}

function reduceImageMetadata<A, T: { [imageName: string]: A }>(state: State, obj: T, metadataReducer: (ImageMetadata, A) => ImageMetadata): State {
  const apps = mapValues(state.apps, (app: App) => {
    const imageName = getDockerImageName(app.definition)
    if (imageName) {
      const metadataObj = obj[imageName]
      if (metadataObj) {
        const metadata = metadataReducer(app.imageMetadata, metadataObj)
        return {
          ...app,
          imageMetadata: metadata,
        }
      }
    }
    return app
  })

  return {
    ...state,
    apps,
    visibleApps: [...state.visibleApps.map(a => apps[a.definition.id])],
  }
}

export function getDockerImageName(definition: AppDefinition): ?string {
  if (definition && definition.container && definition.container.type === 'DOCKER') {
    return definition.container.docker.image
  }
  return undefined
}

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'LoadApplications': {
      const apps = action.response.apps.reduce((o, p) => {
        const appObj = o[p.id]
        o[p.id] = { // eslint-disable-line no-param-reassign
          ...appObj || {
            imageMetadata: {
              labels: {},
              isLoading: false,
            },
          },
          definition: p
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
    case 'LoadApplicationsFailed':
      return {
        ...state,
        isLoading: false,
        loadError: action.error,
      }
    case 'SetFilterText':
      return {
        ...state,
        filterText: action.text,
        visibleApps: visibleApps(state, state.apps, action.text),
      }
    case 'LoadImageMetadataStarted': {
      const imageNames = action.imageNames
      const apps = mapValues(state.apps, (app: App) => {
        const imageName = getDockerImageName(app.definition)
        if (imageName && includes(imageNames, imageName)) {
          return {
            ...app,
            imageMetadata: {
              ...app.imageMetadata,
              isLoading: true,
            }
          }
        }
        return app
      })
      return {
        ...state,
        apps,
        visibleApps: [...state.visibleApps.map(a => apps[a.definition.id])],
      }
    }
    case 'LoadImageMetadata':
      return reduceImageMetadata(state, action.results, (m, r) => ({
        ...m,
        labels: r ? r.labels : {},
        isLoading: false,
        loaded: true,
      }))
    case 'LoadImageMetadataFailed':
      return state
    default:
      (action: empty)
      return state
  }
}
