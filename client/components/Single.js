
import React from 'react'
import { Link } from 'react-router'

const Single = React.createClass({
  render() {
    return (
      <div>
      <h1>
        <Link to="/">Karanstagram</Link>
      </h1>
      {React.cloneElement(this.props.children, this.props)}

      </div>
    )
  }
});

export default Single;
