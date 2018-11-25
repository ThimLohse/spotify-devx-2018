import React, { Component } from 'react';
import style from './index.css';

class userComponent extends Component {
  constructor(props) {
      super(props);
      
      this.state = {
          currentSizeIndex: 0,
          sizes: [window.innerHeight*.1, window.innerHeight*.08],
          dx: Math.random(),
          dy: Math.random(),
          xpos: this.getRandomInt(window.innerWidth),
          ypos: this.getRandomInt(window.innerHeight),
      }
  }

  getRandomInt(max) {
      return Math.floor(Math.random()*Math.floor(max));
  }

  getRandomFloat() {
      return Math.random() - 1;
  }

  componentDidMount() {
      setInterval( () => this.updatePosition(), 10);
      setInterval( () => this.updateSize(), 500);
  }

  updatePosition() {
      console.log(this.props.generatedPlaylist);
      var dx = this.state.dx;
      var dy = this.state.dy;
      if (this.state.xpos >= window.innerWidth-window.innerHeight*0.1 || this.state.xpos < 0) {
          dx = - dx;
      }
      if (this.state.ypos >= window.innerHeight-window.innerHeight*0.1 || this.state.ypos < 0) {
          dy = - dy;
      }
      this.setState({
          dx: dx,
          dy: dy,
          xpos: this.state.xpos + dx,
          ypos: this.state.ypos + dy,
      })
  }

  updateSize() {
      this.setState({
          currentSizeIndex: (this.state.currentSizeIndex + 1)%2,
      })
  }

  render() {
    var pos = {};

    if(this.props.generatedPlaylist!==true){
        pos = {
            position: 'absolute',
            left: this.state.xpos,
            bottom: this.state.ypos,
            backgroundColor: this.props.color, 
            width: this.state.sizes[this.state.currentSizeIndex],
            height: this.state.sizes[this.state.currentSizeIndex],
        }
    } else {
        pos = {
            position: 'absolute',
            left: window.innerWidth-window.innerHeight*0.2 + window.innerHeight*0.05*Math.pow(-1,this.props.index),
            bottom: window.innerHeight-window.innerHeight*0.1*(this.props.index+2),
            backgroundColor: this.props.color, 
            height: window.innerHeight*0.1,
            width: window.innerHeight*0.1,
        }
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
