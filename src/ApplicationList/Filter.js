// @flow
import React from 'react'
import { Container, Input } from 'semantic-ui-react'

export default class Filter extends React.PureComponent {
  props: {
    filterText: string,
    onFilterTextChanged: string => any
  }

  onChange = (e: any, data: any) => {
    this.props.onFilterTextChanged(data.value)
  }

  render() {
    return (
      <Container>
        <Input autoFocus icon="search" iconPosition="left" placeholder="Filter..." value={this.props.filterText} onChange={this.onChange} />
      </Container>
    )
  }
}
