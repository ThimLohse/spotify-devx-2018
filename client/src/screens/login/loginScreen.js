import React, { Component } from 'react';
import style from './index.css';
import SpotifyButton from '../../components/spotify-button/spotifyButton.js';
import LoginButton from '../../components/Login/Login.js';

export default class LoginScreen extends Component {

  render() {
    return (
      <div className="login-screen">
          <LoginButton/>
      </div>
    );
  }
}