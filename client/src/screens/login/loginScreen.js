import React, { Component } from 'react';
import style from './index.css';
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
