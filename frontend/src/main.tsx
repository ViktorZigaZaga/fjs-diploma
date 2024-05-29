import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store'
import App from './App'
import { Auth } from './features/auth';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Provider store={store}>
      <Auth><App /></Auth>
    </Provider>
  </>
)