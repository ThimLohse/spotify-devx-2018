import React, { Component } from 'react';
import style from './index.css';

class userComponent extends Component {

  render() {
    return (
      <div className="user-container">
        <img className="user-image"  alt="user avatar"/>
        <p>JESPER</p>
      </div>
    );
  }
}

export default userComponent;
