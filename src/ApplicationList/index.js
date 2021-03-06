// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Container, Message, Loader } from 'semantic-ui-react'
import type { RootState } from './../store'
import { loadApplications, setFilterText } from './actions'
import { returnTypeOf } from './../common/redux-flow'
import ApplicationItemGroup from './ApplicationItemGroup'
import Filter from './Filter'
import './ApplicationList.css'
import { initializeConfig } from './config'

class ApplicationList extends React.PureComponent {
  componentDidMount() {
    //  TODO: initialization (i.e. configuration retrieval) should be a proper action instead
    initializeConfig().then(() => this.props.loadApplications())
  }

  props: Props

  render() {
    const { visibleApps, filterText, isLoading, wasLoaded } = this.props
    const hasFilter = filterText.trim().length > 0

    if (isLoading && !wasLoaded) {
      return <Loader active>Loading Marathon applications</Loader>
    }

    return (
      <div>
        <Container textAlign="center">
          <Filter filterText={filterText} onFilterTextChanged={this.props.setFilterText} />
        </Container>
        <Container fluid className="applications-content">
          <ApplicationItemGroup apps={visibleApps} />
          {visibleApps.length === 0
            ? (<Message info icon={hasFilter ? 'search' : undefined} header="Empty application list" content={hasFilter ? 'No applications matching your filter' : 'No applications found in Marathon'} />)
            : null
          }
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (rootState: RootState) => ({
  ...rootState.applicationList,
})

const mapDispatchToProps = {
  setFilterText,
  loadApplications,
}

const mapStateToPropsType = returnTypeOf(mapStateToProps)
type Props = {|...typeof mapStateToPropsType, ...typeof mapDispatchToProps|}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationList)
