// @flow
import { sortBy, words, every } from 'lodash'
import type { App } from './reducer'

export default function matchApps(apps: App[], filter: string): App[] {
  const filterWords = words(filter).map(w => w.toLowerCase())

  const appList = sortBy(apps, a => a.definition.id)

  if (filterWords.length === 0) {
    return appList
  }

  return appList.filter(a => {
    const id = a.definition.id.toLowerCase()
    return every(filterWords, w => id.indexOf(w) !== -1)
  })
}
