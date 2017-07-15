// @flow
import React, { PureComponent } from 'react'
import { Container } from 'semantic-ui-react'
import './App.css'
import ApplicationList from './ApplicationList'

class App extends PureComponent {
  render() {
    return (
      <Container>
        <ApplicationList />
      </Container>
    )
  }
}

export default App
