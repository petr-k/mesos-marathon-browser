// @flow
import React from 'react'
import { Card } from 'semantic-ui-react'
import type { App } from './reducer'
import ApplicationItem from './ApplicationItem'

export default class ApplicationItemGroup extends React.PureComponent {
  props: {
    apps: App[],
  }

  render() {
    const { apps } = this.props
    return (
      <Card.Group>
        {apps.map(a => <ApplicationItem app={a} key={a.definition.id} />)}
      </Card.Group>
    )
  }
}
