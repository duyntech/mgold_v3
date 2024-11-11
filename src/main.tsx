import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'


import './index.css'
import '../src/assets/scss/style.scss'

import 'primereact/resources/themes/lara-light-teal/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'remixicon/fonts/remixicon.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={ store } > <App /></Provider >
)
