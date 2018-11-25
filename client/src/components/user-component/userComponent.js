import React, { Component } from 'react';
import style from './index.css';

class userComponent extends Component {
  constructor(props) {
      super(props);
      this.userComponentId = null;
      this.state = {
          //currSize: this.props.size,
          //dsize: this.props.size*.0025,
          maxSize: this.props.size,
          minSize: this.props.size*.5,
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
      setInterval( () => this.updatePosition(), 10);
      //setInterval( () => this.updateSize(), 20);
  }
  componentWillUnmount(){
    clearInterval(this.userComponentId);
    this.userComponentId = null;
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

  /*
  updateSize() {
      var dsize = this.state.dsize;
      if (this.state.currSize > this.state.maxSize || this.state.currSize < this.state.minSize) {
          dsize = -dsize;
      }
      this.setState({
          dsize: dsize,
          currSize: this.state.currSize + dsize,
      })
  }
  */

  render() {
    var pos = {};

    if(this.props.generatedPlaylist!==true){
        pos = {
            position: 'absolute',
            left: this.state.xpos,
            bottom: this.state.ypos,
            backgroundColor: this.props.color, 
            //maxWidth: this.state.currSize,
            //maxHeight: this.state.currSize,
            //width: this.state.currSize,
            //height: this.state.currSize
        }
    } else {
        pos = {
            position: 'absolute',
            left: window.innerWidth-window.innerHeight*0.2 + window.innerHeight*0.05*Math.pow(-1,this.props.index),
            bottom: window.innerHeight-window.innerHeight*0.1*(this.props.index+2),
            backgroundColor: this.props.color,
            //maxWidth: this.state.maxSize,
            //maxHeight: this.state.maxSize, 
            //height: this.state.maxSize,
            //width: this.state.maxSize,
        }
    }

    return (
      <div className="user-container" style={pos}>
        <img className="user-image" src={this.props.avatar} alt="user avatar"/>
        <h2>{this.props.name}</h2>
        
        <div className="user-info">
            <div className="user-info-arrow"/>
            <p>{this.props.name}</p> 
        </div>
      </div>
    );
  }
}

export default userComponent;
