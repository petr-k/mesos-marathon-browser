// @flow
import React from 'react'
import { Label } from 'semantic-ui-react'

export default class ApplicationInstanceCountLabels extends React.PureComponent {
  props: {
    instances: number,
    tasksHealthy: number,
    tasksRunning: number,
    tasksUnhealthy: number,
    tasksStaged: number,
  }

  render() {
    return (
      <div className="middle-inline-block label-list">
        {this.getLabels().map(({ name, color, count }) => <Label size="small" key={name} color={color}>{count ? `${count} ` : ''}{name}</Label>)}
      </div>
    )
  }

  getLabels() {
    const label = (name: string, color: ?string, count: ?number) => ({ name, color, count })
    const { instances, tasksHealthy, tasksRunning, tasksUnhealthy, tasksStaged } = this.props
    if (instances === 0 && tasksRunning === 0) {
      return [label('Suspended', 'grey')]
    }
    const labels = []
    if (tasksHealthy) {
      labels.push(label('Healthy', 'green', tasksHealthy))
    }
    if (tasksUnhealthy) {
      labels.push(label('Unhealthy', 'red', tasksUnhealthy))
    }
    if (tasksRunning && !tasksHealthy && !tasksUnhealthy) {
      labels.push(label('Running', undefined, tasksRunning))
    }
    if (tasksStaged) {
      labels.push(label('Staged', 'yellow', tasksStaged))
    }
    return labels
  }
}
