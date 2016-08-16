import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_TAG = 'SELECT_TAG'
export const INVALIDATE_TAG = 'INVALIDATE_TAG'

export function selectTag(tag) {
  return {
    type: SELECT_TAG,
    tag
  }
}

export function invalidateTAG(tag) {
  return {
    type: INVALIDATE_TAG,
    tag
  }
}

function requestPosts(tag) {
  return {
    type: REQUEST_POSTS,
    tag
  }
}

function receivePosts(tag, json) {
  return {
    type: RECEIVE_POSTS,
    tag,
    posts: json.items,
    receivedAt: Date.now()
  }
}

function fetchPosts(tag) {
  return dispatch => {
    dispatch(requestPosts(tag))
    return fetch(`https://api.stackexchange.com/2.2/questions?tagged=${tag}&site=stackoverflow`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(tag, json)))
  }
}

function shouldFetchPosts(state, tag) {
  const posts = state.postsByTag[tag]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export function fetchPostsIfNeeded(tag) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), tag)) {
      return dispatch(fetchPosts(tag))
    }
  }
}
