import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectTag, fetchPostsIfNeeded, invalidateTag } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedTag } = this.props
    dispatch(fetchPostsIfNeeded(selectedTag))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTag !== this.props.selectedTag) {
      const { dispatch, selectedTag } = nextProps
      dispatch(fetchPostsIfNeeded(selectedTag))
    }
  }

  handleChange(nextTag) {
    this.props.dispatch(selectTag(nextTag))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedTag } = this.props
    dispatch(invalidateTag(selectedTag))
    dispatch(fetchPostsIfNeeded(selectedTag))
  }

  render() {
    const { selectedTag, posts, isFetching, lastUpdated } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>
	    <h1>StackOverFlow Parser</h1>
        <Picker value={selectedTag}
                onChange={this.handleChange}
                options={[ 'angular','react','wordpress' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

App.propTypes = {
  selectedTag: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedTag, postsByTag } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByTag[selectedTag] || {
    isFetching: true,
    items: []
  }

  return {
    selectedTag,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
