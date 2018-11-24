import React, { Component } from 'react';
import style from './index.css';

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
    
    var newTop = this.getRandomInt(0, 200);
    var newLeft = this.getRandomInt(0, 500);

    return (

      <div className="user-container" style={{top : newTop, left: newLeft}}>
        <img className="user-image" src={this.props.avatar} alt="user avatar"/>
        <p>{this.props.name}</p>
      </div>
    );
  }
}

export default userComponent;
