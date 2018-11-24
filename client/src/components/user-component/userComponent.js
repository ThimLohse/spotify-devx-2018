import React, { Component } from 'react';
import style from './index.css';
import owl from '../../owl.png'

class userComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      xPos: 0,
      yPos: 0,
      speed: 1,
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

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
