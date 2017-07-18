import React from 'react'
import { Card } from 'semantic-ui-react'
import type { AppDefinition } from './../api'
import { getDockerImageName } from './reducer'

export default class ApplicationItemMeta extends React.PureComponent {
  props: {
    definition: AppDefinition,
  }

  render() {
    const { definition } = this.props
    const imageName = getDockerImageName(definition)

    return (
      <Card.Meta>
        <div>Mem: {definition.mem}, CPUs: {definition.cpus}</div>
        {imageName && <div>{imageName}</div>}
      </Card.Meta>
    )
  }
}
