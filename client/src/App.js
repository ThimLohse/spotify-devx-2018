import React, {
  Component
} from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Room from './Components/Room/Room';
import queryString from 'query-string';
import {Button} from 'react-bulma-components/full';


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      access_token: null,
      refresh_token: null,
        isLoggedIn: false
    }
  }
  componentDidMount() {
    //Call the backend API
    const parsed = queryString.parse(window.location.hash);
    if(parsed.access_token != null){
      let tempState = this.state;
      tempState.access_token = parsed.access_token;
      tempState.refresh_token = parsed.refresh_token;
      tempState.isLoggedIn = true;

      this.setState(tempState);
      window.location.hash = '';


    }

  }


  render() {
    let view = null;
    view = this.state.isLoggedIn ? <Room access_token={this.state.access_token} refresh_token={this.state.refresh_token}/> : <Login/>;

    return (

      <div className = "App">
      <header className = "App-header" >
          {view}
      </header>
      </div>
    );
  }
}

export default App;
