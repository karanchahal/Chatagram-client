import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'

import * as actionCreators from '../actions/actionCreators'

import Main from './Main';

function mapStateFromProps(state) {
  return {
    posts: state.posts,
    comments: state.comments
  }
}

function mapDispatchfromProps(dispatch) {
  return bindActionCreators(actionCreators,dispatch)
}


const App = connect(mapStateFromProps,mapDispatchfromProps)(Main);

export default App;
