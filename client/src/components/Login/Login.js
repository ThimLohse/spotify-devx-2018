import React, {
  Component
} from 'react';
import Button from '../spotify-button/spotifyButton.js';
import queryString from 'query-string';
/*import {Button} from 'react-bulma-components/full';*/

class Login extends Component {

  redirectHandler = () => {

    this.loginHandler().then((res) => {
      window.location = res.url;
    }).catch((err) => {
      console.log(err.message);
    });

  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  loginHandler = async () => {
    const response = await fetch('/login');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  render() {

    return (<Button onClick={this.redirectHandler().bind(this)}>Login</Button>);
  }
}

export default Login;
