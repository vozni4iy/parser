import React, { PropTypes, Component } from 'react'

export default class Posts extends Component {
	
  render() {
	  
	var decodeHtmlEntity = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
	
	var removeQuotes = function(str) {
		return str.replace(/&quot;/g,"\"");
	};
	
    return (
      <ul>
        {this.props.posts.map((post, i) =>
          <li key={i}>
			  <a href={post.link}>{removeQuotes(decodeHtmlEntity(post.title))}</a>
		  </li>
        )}
      </ul>
    )
  }
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}
