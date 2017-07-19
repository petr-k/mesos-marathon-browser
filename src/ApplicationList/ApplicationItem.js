// @flow
import React from 'react'
import { Card, Grid, Divider, Label, Icon } from 'semantic-ui-react'
import type { App } from './reducer'
import type { AppDefinition } from './../api'
import LabelList from './LabelList'
import ApplicationItemMeta from './ApplicationItemMeta'
import ApplicationInstanceCountLabels from './ApplicationInstanceCountLabels'

export default class ApplicationItem extends React.PureComponent {
  props: {
    app: App,
  }

  render() {
    const { app: { definition, imageMetadata } } = this.props
    const [appLabelCount, imageLabelCount] = [definition.labels, imageMetadata.labels].map(Object.keys).map(v => v.length)
    const color = ApplicationItem.getStatesColor(definition)

    return (
      <Card fluid color={color} className="application-item">
        <Card.Content>
          <Card.Header>
            <span className="middle-inline-block">{definition.id}</span>
            <ApplicationInstanceCountLabels
              instances={definition.instances}
              tasksHealthy={definition.tasksHealthy}
              tasksRunning={definition.tasksRunning}
              tasksUnhealthy={definition.tasksUnhealthy}
              tasksStaged={definition.tasksStaged}
            />
            {imageMetadata.isLoading && <Label corner><Icon name="circle notched" loading /></Label>}
            {imageMetadata.loadError && <Label as="span" title="Error loading Docker image info" corner color="pink"><Icon name="exclamation" /></Label>}
          </Card.Header>
          <ApplicationItemMeta definition={definition} />
          <Card.Description>
            {(appLabelCount || imageLabelCount) ? (
              <Grid columns={2} stackable>
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
