import React from 'react'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import numeral from 'numeral'

import Main from 'components/common/ui/Main'
import Header from 'components/common/ui/Header'

import { getStream } from 'reducers/StreamReducer'

const ENTER_KEY = 13

class ListStreamPage extends React.Component {
  state = {
    filter: ''
  }

  handleSearchKeyDown(e) {
    if (e.keyCode !== ENTER_KEY) {
      return
    }

    e.preventDefault()
    this.props.getStream(this.state.filter)
  }

  handleSearchQueryChanged(e) {
    this.setState({
      filter: e.target.value
    })
  }

  componentDidMount() {
    this.props.getStream()
  }

  handlePageClick = data => {
    this.props.getStream(this.state.filter, data.selected + 1)
  }

  render() {
    return (
      <Main>
        <Header title={'All streams'} />
        <div className="row">
          <div className="col-sm-12">
            <form className="form-search">
              <div className="row">
                <div className="col-sm-12">
                  <input
                    type="text"
                    className="form-control"
                    id="#"
                    placeholder="Search by id"
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
                  <th>id</th>
                  <th>source_id</th>
                  <th width="30%">title</th>
                  <th>size</th>
                  <th>updated date</th>
                </tr>
              </thead>
              <tbody>
                {this.props.streams.map(stream => (
                  <tr key={stream.id.toString()}>
                    <td>{stream.id}</td>
                    <td>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://drive.google.com/open?id=${
                          stream.source_id
                        }`}
                      >
                        {stream.source_id}
                      </a>
                    </td>
                    <td style={{ wordBreak: 'break-word' }}>{stream.title}</td>
                    <td>{numeral(stream.size).format('0.00b')}</td>
                    <td>{stream.updated_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-sm-12">
            {/*<Pagination />*/}
            <ReactPaginate
              previousLabel={'«'}
              nextLabel={'»'}
              breakLabel={'...'}
              pageCount={this.props.pagination.total_pages}
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
        </div>
      </Main>
    )
  }
}

const mapStateToProps = state => {
  return state.stream
}
const mapDispatchToProps = dispatch => ({
  getStream: (filter, page) => dispatch(getStream(filter, page))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStreamPage)