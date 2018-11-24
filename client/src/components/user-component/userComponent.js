import React, { Component } from 'react';
import style from './index.css';

class userComponent extends Component {
  constructor(props) {
      super(props);
      this.userComponentId = null;
      this.state = {
          dx: Math.random(),
          dy: Math.random(),
          xpos: Math.floor(this.getRandomInt(window.innerWidth)/2 + window.innerWidth/5),
          ypos: Math.floor(this.getRandomInt(window.innerHeight)/2 + window.innerHeight/5),
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
  componentWillUnmount(){
    clearInterval(this.userComponentId);
    this.userComponentId = null;
  }

  updatePosition() {
      var dx = this.state.dx;
      var dy = this.state.dy;
      if (this.state.xpos >= window.innerWidth-30 || this.state.xpos < 0) {
          dx = - dx;
      }
      if (this.state.ypos >= window.innerHeight-30 || this.state.ypos < 0) {
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
        bottom: this.state.ypos,
        backgroundColor: this.props.color,
    }

    return (
      <div className="user-container" style={pos}>
      <img className="user-image" src={this.props.avatar} alt="user avatar"/>
        <p>{this.props.name}</p>
      </div>
    );
  }
}

export default userComponent;
