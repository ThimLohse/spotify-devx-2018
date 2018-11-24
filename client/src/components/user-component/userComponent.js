import React, { Component } from 'react';
import style from './index.css';
import owl from '../../owl.png'

class userComponent extends Component {

  render() {
    return (
      <div className="user-container">
        <img className="user-image" src={owl} alt="user avatar"/>
        <p>{this.props.name}</p>
      </div>
    );
  }
}

export default userComponent;
