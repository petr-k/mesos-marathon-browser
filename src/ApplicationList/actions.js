// @flow
import type { Dispatch } from 'redux'
import apiClient from './../api'
import type { AppsResponse, DockerImageMetadataBatch } from './../api'

type LoadApplicationsStarted = { type: 'LoadApplicationsStarted' }
type LoadApplications = { type: 'LoadApplications', response: AppsResponse }
type LoadApplicationsFailed = { type: 'LoadApplicationsFailed', error: string }
type SetFilterText = { type: 'SetFilterText', text: string }
type LoadImageMetadataStarted = { type: 'LoadImageMetadataStarted', imageNames: string[] }
type LoadImageMetadata = { type: 'LoadImageMetadata', results: DockerImageMetadataBatch }
type LoadImageMetadataFailed = { type: 'LoadImageMetadataFailed', error: string, imageNames: string[] }

export type Action =
  | LoadApplicationsStarted
  | LoadApplications
  | LoadApplicationsFailed
  | SetFilterText
  | LoadImageMetadataStarted
  | LoadImageMetadata
  | LoadImageMetadataFailed

export const loadApplications = () => (dispatch: Dispatch<Action>) => {
  return (async () => {
    try {
      dispatch({ type: 'LoadApplicationsStarted' })
      const response = await apiClient.getApps()
      dispatch({ type: 'LoadApplications', response })
      return response
    } catch (err) {
      dispatch({ type: 'LoadApplicationsFailed', error: err.message })
      throw err
    }
  })()
}

export function setFilterText(text: string): SetFilterText {
  return {
    type: 'SetFilterText',
    text,
  }
}

export const loadImageMetadata = (imageNames: string[]) => (dispatch: Dispatch<Action>) => {
  (async () => {
    try {
      dispatch({ type: 'LoadImageMetadataStarted', imageNames })
      const results = await apiClient.getDockerImageMetadataBatch(imageNames)

      dispatch({
        type: 'LoadImageMetadata',
        results,
      })
    } catch (err) {
      dispatch({ type: 'LoadImageMetadataFailed', error: err.message, imageNames })
    }
  })()
}
