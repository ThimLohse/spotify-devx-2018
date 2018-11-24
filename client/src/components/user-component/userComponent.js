import React, { Component } from 'react';
import style from './index.css';

class userComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: props.user,
    }
  }

  render() {
    return (
      <div className="user-container">
        <img className="user-image"  alt="user avatar"/>
      </div>
    );
  }
}

export default userComponent;
