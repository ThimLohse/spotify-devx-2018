import React, { Component } from 'react';
import UserComponent from '../../components/user-component/userComponent.js';
import SpotifyButton from '../../components/spotify-button/spotifyButton.js';
import style from './index.css';

class roomScreen extends Component {
  
  render() {
    return (
        <div className="room-screen">
<<<<<<< HEAD
          <UserComponent name="LI"/>
=======
            <UserComponent/>
            <SpotifyButton>
            MASH PLAYLIST
            </SpotifyButton>
>>>>>>> fa0562d39e76eb6ab5f37776b1e3daab2c65681c
        </div>
    );
  }
}

export default roomScreen;
