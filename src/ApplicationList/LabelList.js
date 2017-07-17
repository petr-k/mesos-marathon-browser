// @flow
import React from 'react'
import Linkify from 'react-linkify'
import { sortBy } from 'lodash'

export default class LabelList extends React.PureComponent {
  props: {
    labels: {[string]: string},
  }

  render() {
    const { labels } = this.props
    return (
      <ul>
        {sortBy(Object.keys(labels)).map(name => <li key={name}><em>{name}: <Linkify properties={{ target: '_blank' }}>{labels[name]}</Linkify></em></li>)}
      </ul>
    )
  }
}
