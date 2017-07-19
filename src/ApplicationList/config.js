// @flow
import apiClient from './../api'
import type { Config } from './../api'

let config: Config = {
  marathonUrl: '',
}

export function initializeConfig() {
  return apiClient.getConfig().then(c => {
    config = c
    return c
  })
}

export function getConfig() {
  return config
}
