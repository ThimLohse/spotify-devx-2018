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
          move: true,
          user: this.props.user,
          lastPosX: '',
          lastPosY: '',
          windowHeight: window.innerHeight, 
          windowWidth: window.innerWidth,
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
    if(this.state.windowHeight !== window.innerHeight){
        this.setState({windowHeight: window.innerHeight});
        this.setState({xpos:window.innerHeight/4});
    }
    if(this.state.windowWidth !== window.innerWidth){
        this.setState({windowWidth: window.innerWidth});
        this.setState({ypos:window.innerWidth/4});
    }

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

    if(this.state.move !== true){
        this.setState({lastPosX: this.state.xpos});
        this.setState({lastPosy: this.state.ypos});
    } 
  }

  render() {
    var pos = {
        position: 'absolute',
        Animation: 'none',
    };

    if(this.state.move){
        pos = {
            position: 'absolute',
            left: this.state.xpos,
            bottom: this.state.ypos,
            backgroundColor: this.props.color,
            Animation: 'pulse',
        }
    } else {
        pos = {
            position: 'absolute',
            Animation: 'none',
            backgroundColor: this.props.color,
            left: this.state.lastPosX,
            top: this.state.lastPosY,
        }
    }

    return (
      //<div className="user-container" style={pos} onClick={() => this.setState({move:!this.state.move})}>
      <div className="user-container" style={pos} >
        <img className="user-image" src={this.props.avatar} alt="user avatar"/>
        <h2>{this.props.name}</h2>
        
        <div className="user-info">
            <div className="user-info-arrow"/>
            <p>{"Top artist: " + this.props.user.metadata.top_artist}</p> 
            <p>{"Top track: " + this.props.user.metadata.top_track}</p> 
            <p>{"Top genre: " + this.props.user.metadata.top_genres[0][0]}</p> 
        </div>
      </div>
    );
  }
}

export default userComponent;
