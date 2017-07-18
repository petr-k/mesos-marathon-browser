import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import 'babel-polyfill'
import App from './App'
import store from './store'
import './index.css'

const render = () => ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  window.document.getElementById('root')
)

if (module && module.hot && module.hot.accept) {
  module.hot.accept(App, render)
}

render()
