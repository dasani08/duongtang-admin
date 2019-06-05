import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import LayoutSidebar from 'components/layout/LayoutSidebar'
import LayoutMain from 'components/layout/LayoutMain'
import LayoutPageHead from 'components/layout/LayoutPageHead'
import ReactPaginate from 'react-paginate'
import CreateUserModal from './CreateUserModal'
import {
  getUsers,
  toggleCreateUserModal,
  updateUserStatus
} from 'reducers/UserReducer'

const ENTER_KEY = 13

class ListUserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getDefaultState()
  }

  componentDidMount() {
    this.props.getUsers()
  }

  componentWillUnmount() {
    this.props.toggleCreateUserModal(false)
  }

  getDefaultState() {
    return {
      filter: '',
      meta: {},
      users: [],
      isOpenCreateUserModal: false
    }
  }

  handleSearchKeyDown(e) {
    if (e.keyCode !== ENTER_KEY) {
      return
    }

    e.preventDefault()
    this.props.getUsers(this.state.filter)
  }

  handleSearchQueryChanged(e) {
    this.setState({
      filter: e.target.value
    })
  }

  handlePageClick = data => {
    this.props.getUsers(this.state.filter, data.selected + 1)
  }

  render() {
    return (
      <React.Fragment>
        <LayoutSidebar />
        <CreateUserModal />
        <LayoutMain>
          <React.Fragment>
            <div className="col-sm-12">
              <LayoutPageHead title={'Users'}>
                <button
                  className="btn btn-success"
                  onClick={() => this.props.toggleCreateUserModal(true)}
                >
                  Add User
                </button>
              </LayoutPageHead>
            </div>

            <div className="col-sm-12">
              <form className="form-search">
                <div className="row">
                  <div className="col-sm-12">
                    <input
                      type="text"
                      className="form-control"
                      id="#"
                      placeholder="Search by id or email"
                      value={this.state.filter}
                      onKeyDown={this.handleSearchKeyDown.bind(this)}
                      onChange={this.handleSearchQueryChanged.bind(this)}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="col-sm-12">
              <table className="table table-align-right">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Created date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.users.map(item => (
                    <tr key={item.id.toString()}>
                      <td>{item.id}</td>
                      <td>
                        <Link to={`${this.props.match.path}/${item.id}`}>
                          {item.email ? item.email : 'No email'}
                        </Link>
                      </td>
                      <td>{item.created_date}</td>
                      <td>
                        <button
                          className={`btn btn-xs btn-outline-${
                            item.is_active ? 'danger' : 'success'
                          }`}
                          onClick={() =>
                            this.props.updateUserStatus(
                              item.id,
                              !item.is_active
                            )
                          }
                        >
                          {item.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
            </div>

            <div className="col-sm-12">
              {/*<Pagination />*/}
              <ReactPaginate
                previousLabel={'«'}
                nextLabel={'»'}
                breakLabel={'...'}
                pageCount={this.props.meta.total_pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={'pagination justify-content-end'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                nextClassName={'page-item'}
                breakClassName={'page-item'}
                previousClassName={'page-item'}
                pageLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                breakLinkClassName={'page-link'}
                previousLinkClassName={'page-link'}
              />
            </div>
          </React.Fragment>
        </LayoutMain>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.user.users,
    meta: state.user.pagination
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getUsers: (filter, page) => dispatch(getUsers(filter, page)),
    toggleCreateUserModal: isOpen => dispatch(toggleCreateUserModal(isOpen)),
    updateUserStatus: (id, is_active) =>
      dispatch(updateUserStatus(id, is_active))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListUserPage)
