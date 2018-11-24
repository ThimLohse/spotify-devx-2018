import React, { Component } from 'react';
import style from './index.css';

class spotifyButton extends Component {
  render() {
    return (
      <div className="spotify-button">
        {this.props.children}
      </div>
    );
  }
}

export default spotifyButton;
