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
  top_tracks = [];
  playlists = []

  constructor(props) {
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token
    }
    this.socket = null;

    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(this.state.access_token);
  }

  componentDidMount() {
    this.socket = socketClient();

    var _this = this

    this.spotifyApi.getMe()
    .then(function(data) {
      _this.user_data = data.body
      console.log('User data: ', data.body);
      _this.socket.emit('user_data', _this.user_data);

    }, function(err) {
      console.log('Something went wrong!', err);
    });


    this.spotifyApi.getMyTopTracks()
    .then(function(data) {
      for (var i=0; i < data.body.items.length; i++) {
        _this.top_tracks.push({
          name: data.body.items[i].name,
          id: data.body.items[i].id
        })
      }
      console.log('Top tracks: ', _this.top_tracks);
      _this.socket.emit('top_tracks', _this.top_tracks);

    }, function(err) {
      console.log('Something went wrong!', err);
    });


    this.spotifyApi.getUserPlaylists()
    .then(function(data) {
      console.log('User playlists: ', data.body.items);
      for (var i=0; i < data.body.items.length; i++) {
        var name = data.body.items[i].name;
        var id = data.body.items[i].id;
        var json = {
          name: name,
          id: id,
          tracks: []
        }
        _this.playlists.push(json)
        _this.getPlaylistTracks(_this, i, id);
      }
      console.log(_this.playlists)

    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  getPlaylistTracks(_this, i, id) {
    _this.spotifyApi.getPlaylistTracks(id)
    .then(function(data){
      var temp = []
      for (var j=0; j < data.body.items.length; j++) {
        temp.push({
          name: data.body.items[j].track.name,
          id: data.body.items[j].track.id
        })
      }
      _this.playlists[i]["tracks"] = temp;

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
