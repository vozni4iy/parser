import { combineReducers } from 'redux'
import {
  SELECT_TAG, INVALIDATE_TAG,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

function selectedTag(state = 'angular', action) {
  switch (action.type) {
    case SELECT_TAG:
      return action.tag
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_TAG:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsByTag(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_TAG:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.tag]: posts(state[action.tag], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByTag,
  selectedTag
})

export default rootReducer
