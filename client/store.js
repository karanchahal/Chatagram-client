import  {createStore, compse} from 'redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'

// Import root reducers

import rootReducer from './reducers/index'

import comments from './data/comments'
import posts from './data/posts'

const defaultStore = {
  posts,
  comments
};

const store = createStore(rootReducer, defaultStore)

export const history = syncHistoryWithStore(browserHistory,store)

export default store;
