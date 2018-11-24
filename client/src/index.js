import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoginScreen from './screens/login';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

const App = () => (
    <Router>
      <div>
        <Route path = "/" render={()=>{ return handleRoute(<LoginScreen/>)}}/>
      </div>
    </Router>
)

const handleRoute = (component) => {
    /*
    if(sessionStorage.isLoggedIn==='true'){
      return component
    } else {
      return <Redirect to='/LoginScreen'/>
    }*/

    return <Redirect to='/LoginScreen'/>
  }

ReactDOM.render(<LoginScreen />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
