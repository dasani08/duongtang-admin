import client from 'client'

const defaultState = {
  streams: [],
  pagination: {},
  isLoading: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_STREAM_BEGIN':
      return {
        ...state,
        isLoading: true
      }
    case 'LOAD_STREAM_COMPLETE':
      return {
        streams: action.data.items,
        pagination: action.data.meta,
        isLoading: false
      }
    default:
      return state
  }
}

export const getStream = (source_id, page) => {
  return dispatch => {
    dispatch({ type: 'LOAD_STREAM_BEGIN' })
    return client.get('/admin/streams', { source_id, page }).then(res => {
      dispatch({ type: 'LOAD_STREAM_COMPLETE', data: res.data })
    })
  }
}

export const getTopViewedStream = page => {
  return dispatch => {
    dispatch({ type: 'LOAD_STREAM_BEGIN' })
    return client.get('/admin/top-viewed-stream', { page }).then(res => {
      const { items, meta } = res.data
      const descSort = (a, b) => {
        if (a.view < b.view) {
          return 1
        }
        if (a.view >= b.view) {
          return -1
        }
        return 0
      }
      dispatch({
        type: 'LOAD_STREAM_COMPLETE',
        data: {
          items: items.sort(descSort),
          meta: meta
        }
      })
    })
  }
}
