// @flow
import React from 'react'

export default class LabelList extends React.PureComponent {
  props: {
    labels: {[string]: string},
  }

  render() {
    const { labels } = this.props
    return (
      <ul>
        {Object.keys(labels).map(name => <li key={name}><em>{name}: {labels[name]}</em></li>)}
      </ul>
    )
  }
}
