import React, {
  Component
} from 'react';
import queryString from 'query-string';
import {
  Button
} from 'react-bulma-components/full';
import socketClient from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';

class Room extends Component {
  user_data = {};

  constructor(props) {
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token
    }
    this.socket = null;
    this.top_tracks = []

    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(this.state.access_token);
  }

  componentDidMount() {
    this.socket = socketClient();
    this.socket.emit('user_id', this.state);

    var _this = this

    this.spotifyApi.getMe()
    .then(function(data) {
      _this.user_data = data.body
      console.log('User data: ', data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    this.spotifyApi.getMyTopTracks()
    .then(function(data) {
      _this.top_tracks = data.body.items;
      console.log('Top tracks: ', data.body.items);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }


  render() {
    console.log(this.state);
    return ( <
      div >
      THIS IS THE ROOM <
      /div>
    );
  }
}

export default Room;
