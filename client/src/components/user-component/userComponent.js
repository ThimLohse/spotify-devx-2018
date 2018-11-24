import React, { Component } from 'react';
import style from './index.css';
import owl from '../../owl.png'

class userComponent extends Component {
  constructor(props) {
      super(props);
      
      this.state = {
          dx: Math.random(),
          dy: Math.random(),
          xpos: this.getRandomInt(window.innerWidth),
          ypos: this.getRandomInt(window.innerHeight)
      }
  }

  getRandomInt(max) {
      return Math.floor(Math.random()*Math.floor(max));
  }

  getRandomFloat() {
      return Math.random() - 1;
  }

  componentDidMount() {
      this.userComponentId = setInterval(
        () => this.updatePosition(),
        10
      );
  }

  updatePosition() {
      var dx = this.state.dx;
      var dy = this.state.dy;
      if (this.state.xpos >= window.innerWidth || this.state.xpos < 0) {
          dx = - dx;
      }
      if (this.state.ypos >= window.innerHeight || this.state.ypos < 0) {
          dy = - dy;
      }
      this.setState({
          dx: dx,
          dy: dy,
          xpos: this.state.xpos + dx,
          ypos: this.state.ypos + dy,
      })
  }

  render() {
    const pos = {
        position: 'absolute',
        left: this.state.xpos,
        bottom: this.state.ypos
    }
    return (
      <div className="user-container" style={pos}>
        <img className="user-image" src={owl} alt="user avatar"/>
        <p>{this.props.name}</p>
      </div>
    );
  }
}

export default userComponent;
