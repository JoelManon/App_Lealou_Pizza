/* @refresh reload */
import './index.css'
import { hydrate } from 'solid-js/web'
import App from './App'

hydrate(
  () => <App url={window.location.pathname + window.location.search + window.location.hash} />,
  document.getElementById('root')
)
