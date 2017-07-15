// @flow
import React from 'react'
import { Card } from 'semantic-ui-react'
import type { App } from './reducer'
import type { AppDefinition } from './../marathon'

export default class ApplicationItem extends React.PureComponent {
  props: {
    app: App,
  }

  render() {
    const { app: { definition } } = this.props

    console.log(definition.id)

    return (
      <Card
        fluid
        header={definition.id}
        description={ApplicationItem.getStatesString(definition)}
        color={ApplicationItem.getStatesColor(definition)}
      />
    )
  }

  static getStatesString(definition: AppDefinition) {
    const states: {[string]: number} = {
      Staged: definition.tasksStaged,
      Healthy: definition.tasksHealthy,
      Unhealthy: definition.tasksUnhealthy,
    }
    const statesString = Object.keys(states)
      .map(label => ({ label, count: states[label] }))
      .filter(c => c.count > 0)
      .map(c => `${c.count} ${c.label}`)
      .join(', ')
    return `${definition.tasksRunning} Running${statesString ? ', ' : ''}${statesString}`
  }

  static getStatesColor(definition: AppDefinition) {
    if (definition.tasksRunning === 0 && definition.tasksStaged > 0) {
      return 'yellow'
    }
    if (definition.tasksRunning === 0) {
      return undefined
    }
    if (definition.tasksUnhealthy > 0) {
      return 'red'
    }
    if (definition.tasksStaged > 0) {
      return 'yellow'
    }
    if (definition.tasksHealthy > 0) {
      return 'green'
    }
    return 'grey'
  }
}
