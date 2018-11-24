import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoginScreen from './screens/login/loginScreen.js';
import RoomScreen from './screens/room/roomScreen.js';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import App from './App.js';

/*
const App = () => (
    <Router>
      <div>
        <Route exact path = "/" render={()=>{ return handleRoute(<LoginScreen/>)}}/>
        <Route path = "/room" render={()=>handleRoute(<RoomScreen/>)}/>
      </div>
    </Router>
)*/

/*
const handleRoute = (component) => {
  
  if(sessionStorage.isLoggedIn==='true'){
    return component
  } else {
    return <Redirect to='/LoginScreen'/>
  }

  return component;
}
*/

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
