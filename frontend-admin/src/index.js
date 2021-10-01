import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './assets/css/grid.css'
import './assets/css/theme.css'
import './assets/css/index.css'
import './assets/css/common.css'
import { BrowserRouter ,Switch, Route } from 'react-router-dom';

import { store } from './redux/store'
import { Provider } from 'react-redux'

import LayoutDashboard from './components/layout/LayoutDashboard'
import Login from './pages/Login'
import Home from './pages/Home'
import Logout from './pages/Logout'
import ResetPassword from './pages/ResetPassword'


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path="/dashboard" component={LayoutDashboard} />
          <Route path="/login" component={Login}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/reset_password" component={ResetPassword}/>
        </Switch>
      </BrowserRouter>
    </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
