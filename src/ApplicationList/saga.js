// @flow
import { difference } from 'lodash'
import { select, take, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { loadApplications, loadImageMetadata } from './actions'
import type { LoadApplications } from './actions'
import { getDockerImageName } from './reducer'

function* saga(): any {
  let loadedImageNames = []
  while (true) {
    const loadAction: LoadApplications = yield take('LoadApplications')

    const imageNames = loadAction.response.apps.map(getDockerImageName).filter(n => n)
    const unknownImageNames = difference(imageNames, loadedImageNames)

    if (unknownImageNames.length > 0) {
      loadedImageNames = [...loadedImageNames, ...unknownImageNames]
      yield put(loadImageMetadata(unknownImageNames))
    }

    yield delay(5000)
    yield put(loadApplications())
  }
}

export default saga
