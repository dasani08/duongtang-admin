import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import numeral from 'numeral'

import Main from 'components/common/ui/Main'
import Header from 'components/common/ui/Header'
import Card from 'components/common/ui/Card'

import { getRequest, getRequestDetail } from 'reducers/DashboardReducer'

class DashBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      isOpen: '',
      isView: 'Today views',
      isUpload: 'Today uploads'
    }
    this.handleOpen = this.handleOpen.bind(this)
  }

  componentDidMount() {
    this.props.getRequest()
    this.props.getRequestDetail()

    // init timer
    const timer = setInterval(this.props.getRequest, 60 * 1000)
    this.setState({ timer })
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  handleOpen() {
    if (this.state.isOpen === '') {
      this.setState({
        isOpen: 'open-zoom',
        isView: 'Earn views',
        isUpload: 'Earn uploads'
      })
    } else {
      this.setState({
        isOpen: '',
        isView: 'Today views',
        isUpload: 'Today uploads'
      })
    }
  }

  render() {
    return (
      <Main>
        <Header title={'DashBoard'}>
          <button
            className={`btn btn-zoom ${this.state.isOpen}`}
            onClick={this.handleOpen}
          >
            <i className="icons icon-cross" />
            <i className="icons icon-frame-expand" />
          </button>
        </Header>
        <div className={`row ${this.state.isOpen}`}>
          <div className="col-md-6 col-lg-4">
            <Card
              icon={<i className="icons icon-link" />}
              addClass="card card-green"
              title={this.state.isView}
              numberBody={this.props.today_view}
              numberFoo={this.props.today_view}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Card
              addClass="card card-orange"
              icon={<i className="icons icon-upload" />}
              title={this.state.isUpload}
              numberBody={this.props.today_upload}
              numberFoo={this.props.totay_earn_upload}
            />
          </div>
          <div className="col-md-12 col-lg-4">
            <Card
              icon={<i className="icons icon-cart" />}
              addClass="card card-red"
              title={'Today earns'}
              numberFoo={this.props.totay_earn}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-align-right">
              <thead>
                <tr>
                  <th>User Id</th>
                  <th>Email</th>
                  <th>Total request</th>
                  <th>Total spending</th>
                </tr>
              </thead>
              <tbody>
                {this.props.today_req_details.length > 0 ? (
                  this.props.today_req_details.map(detail => (
                    <tr key={detail.id.toString()}>
                      <td>{detail.id}</td>
                      <td>
                        <Link className="text-break" to={`/users/${detail.id}`}>
                          {detail.email}
                        </Link>
                      </td>
                      <td>{numeral(detail.total_req).format('0,0')}</td>
                      <td>{numeral(detail.total_money).format('0,0')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="alert alert-warning text-center">
                        Chưa có request nào :(
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Main>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.dashboard
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRequest: () => dispatch(getRequest()),
    getRequestDetail: () => dispatch(getRequestDetail())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard)
