import React, { Component } from 'react';
import style from './index.css';
import { withRouter, Link } from 'react-router-dom'

export default class LoginScreen extends Component {

  render() {
    return (
      <div className="login-screen">
          <div className="login-button" label="SIGN IN">
          SIGN IN
          </div>
      </div>
    );
  }
}