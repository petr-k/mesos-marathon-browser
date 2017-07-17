// @flow
import React from 'react'
import { Card, Grid, Divider } from 'semantic-ui-react'
import type { App } from './reducer'
import type { AppDefinition } from './../api'
import LabelList from './LabelList'

export default class ApplicationItem extends React.PureComponent {
  props: {
    app: App,
  }

  render() {
    const { app: { definition, imageMetadata } } = this.props
    const [appLabelCount, imageLabelCount] = [definition.labels, imageMetadata.labels].map(Object.keys).map(v => v.length)
    return (
      <Card fluid color={ApplicationItem.getStatesColor(definition)}>
        <Card.Content>
          <Card.Header>{definition.id}</Card.Header>
          <Card.Meta>{ApplicationItem.getStatesString(definition)}</Card.Meta>
          <Card.Description>
            {(appLabelCount || imageLabelCount) ? (
              <Grid columns={2}>
                <Grid.Row className="label-list-row">
                  <Grid.Column>
                    <Divider horizontal fitted>{appLabelCount} application labels</Divider>
                    <LabelList labels={definition.labels} />
                  </Grid.Column>
                  <Grid.Column>
                    <Divider horizontal fitted>{imageLabelCount} docker image labels</Divider>
                    <LabelList labels={imageMetadata.labels} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              ) : null
            }
          </Card.Description>
        </Card.Content>
      </Card>
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