import React, { Component } from 'react';
import UserComponent from '../../components/user-component/userComponent.js';
import SpotifyButton from '../../components/spotify-button/spotifyButton.js';
import style from './index.css';

class roomScreen extends Component {
  
  render() {
    return (
        <div className="room-screen">
            <UserComponent/>
            <SpotifyButton>
            MASH PLAYLIST
            </SpotifyButton>
        </div>
    );
  }
}

export default roomScreen;
