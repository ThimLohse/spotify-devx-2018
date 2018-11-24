import React, { Component } from 'react';
import style from './index.css';

class spotifyButton extends Component {

  render() {
    return (
      <div className="spotify-button" onClick={this.props.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

export default spotifyButton;
