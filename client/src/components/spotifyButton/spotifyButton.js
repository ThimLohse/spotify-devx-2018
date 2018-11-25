import React, { Component } from 'react';
import style from './index.css';

class spotifyButton extends Component {

  render() {
    return (
      <button className="spotify-button" onClick={() => this.props.onClick()}>
        {this.props.children}
      </button>
    );
  }
}

export default spotifyButton;
