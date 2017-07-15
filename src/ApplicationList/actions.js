// @flow
import type { Dispatch } from 'redux'
import marathonClient from './../marathon'
import type { AppsResponse } from './../marathon'

type LoadApplicationsStarted = { type: 'LoadApplicationsStarted' }
type LoadApplications = { type: 'LoadApplications', response: AppsResponse }
type LoadApplicationsFailed = { type: 'LoadApplicationsFailed', error: string }
type SetFilterText = { type: 'SetFilterText', text: string }

export type Action =
  | LoadApplicationsStarted
  | LoadApplications
  | LoadApplicationsFailed
  | SetFilterText

export const loadApplications = () => (dispatch: Dispatch<Action>) => {
  (async () => {
    try {
      dispatch({ type: 'LoadApplicationsStarted' })
      const response = await marathonClient.getApps()
      dispatch({ type: 'LoadApplications', response })
    } catch (err) {
      dispatch({ type: 'LoadApplicationsFailed', error: err.message })
    }
  })()
}

export function setFilterText(text: string): SetFilterText {
  return {
    type: 'SetFilterText',
    text,
  }
}
