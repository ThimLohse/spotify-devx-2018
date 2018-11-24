import React, { Component } from 'react';
import UserComponent from '../../components/user-component/userComponent.js';
import SpotifyButton from '../../components/spotifyButton/spotifyButton.js';
import style from './index.css';
import socketClient from 'socket.io-client';

class roomScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token,
      userList: [
        {name: 'LI'},
        {name: 'THIM'},
      ],
    }
    this.socket = null;
    this.generatePlaylist = this.generatePlaylist.bind(this);
  }

  generatePlaylist(){
  }

  componentDidMount(){
    this.socket = socketClient();
    this.socket.emit('user_id', this.state);
  }

  componentWillReceiveProps(props){
    this.setState({userList: props.userList});
  }

  render() {
    return (
        <div className="room-screen">

            {this.state.userList.map((user, index) => {
              return <UserComponent name={user.name} key={index} index={index} />
            })}

            <SpotifyButton onClick={this.generatePlaylist()}>
            MASH PLAYLIST
            </SpotifyButton>
        </div>
    );
  }
}

export default roomScreen;
