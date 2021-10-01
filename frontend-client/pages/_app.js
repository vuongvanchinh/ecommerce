import '../styles/globals.css'
import '../assets/css/index.css'
import '../assets/css/common.css'
import '../assets/css/grid.css'
import '../assets/css/theme.css'
import '../assets/boxicons-2.0.7/css/boxicons.min.css'

import ClientLayout from '../Layout/MainLayout'

import {store} from '../redux/store'
import {Provider} from 'react-redux'

function MyApp({ Component, pageProps }) {

  const getLayout  = Component.getLayout || ((page) => (<ClientLayout>{page}</ClientLayout>)) 
 
  return (
    <Provider store={store}>
      {
        getLayout(<Component {...pageProps} />)
      }
    </Provider>
  )
}

export default MyApp
