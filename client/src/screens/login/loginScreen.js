import React, { Component } from 'react';
import style from './index.css';
import Button from '../../components/spotifyButton/spotifyButton.js';

export default class LoginScreen extends Component {

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
    return (
      <div className="login-screen">
        <div id="content">
          <h1 className="titleText">Welcome to </h1>
          <h1 className="title">ZOOCIAL</h1>
          <p className="description">
            ZOOCIAL creates a playlist that mixes the <br/>
            music tastes of everyone in the room.<br/>
          </p>
          <p className="description">
            Less arguing, more time for music.
          </p>
          <Button onClick={() => this.redirectHandler()}>LOG IN TO SPOTIFY</Button>
        </div>
      </div>
    );
  }
}
