// let's go!

import React from 'react'
import { render } from 'react-dom'
import css from './styles/style.styl'

import Main from './components/Main'
import Single from './components/Single'
import PhotoGrid from './components/PhotoGrid'

import { browserHistory, Router, Route,IndexRoute } from 'react-router'

let router = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={PhotoGrid}> </IndexRoute>
      <Route path="/view/:photoid" component={Single}></Route>
    </Route>
  </Router>
)

render(router, document.getElementById('root'))
