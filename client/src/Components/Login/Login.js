import React, {
  Component
} from 'react';
import queryString from 'query-string';
import {Button} from 'react-bulma-components/full';

class Login extends Component {

  constructor(props){
    super(props)
    
  }



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

    const style = {
      'margin': '16px'
    }
    return (<Button style={style} color='success' onClick={() => this.redirectHandler()}>Login</Button>);
  }
}

export default Login;
