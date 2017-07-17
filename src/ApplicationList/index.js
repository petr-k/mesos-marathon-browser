// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Container, Message, Loader } from 'semantic-ui-react'
import type { RootState } from './../store'
import type { AppsResponse } from './../api'
import { loadApplications, setFilterText, loadImageMetadata } from './actions'
import { returnTypeOf } from './../common/redux-flow'
import ApplicationItemGroup from './ApplicationItemGroup'
import Filter from './Filter'
import { getDockerImageName } from './reducer'
import './ApplicationList.css'

class ApplicationList extends React.PureComponent {
  componentDidMount() {
    (this.props.loadApplications(): any).then((r: AppsResponse) => {
      const imageNames: string[] = (r.apps.map(getDockerImageName).filter(n => n): any)
      this.props.loadImageMetadata(imageNames)
    })
  }

  props: Props

  render() {
    const { visibleApps, filterText, isLoading } = this.props
    const hasFilter = filterText.trim().length > 0

    if (isLoading) {
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
  loadImageMetadata,
}

const mapStateToPropsType = returnTypeOf(mapStateToProps)
type Props = {|...typeof mapStateToPropsType, ...typeof mapDispatchToProps|}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationList)
