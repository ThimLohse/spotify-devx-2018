import React, {
  Component
} from 'react';
import queryString from 'query-string';
import {
  Button
} from 'react-bulma-components/full';
import socketClient from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';
import generateName from 'sillyname';


class Room extends Component {


  constructor(props) {
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token
    }
    this.socket = null;
    this.playlist_id = null;
    this.dataObject = {
      user_data: {},
      top_tracks: [],
      playlists: []
    };

    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(this.state.access_token);
  }

  generatePlayList(){
    this.socket.emit('generate_playlist');
    this.createPlaylist([]);

  }

  async createPlaylist(tracks){
    var name = generateName();
    var id = this.dataObject.user_data.id;
    var data = await this.spotifyApi.createPlaylist(id, name, { 'public' : false })
    this.playlist_id = data.body.id;
    var uri = data.body.uri;
    var tracks_id = []
    for (var i=0; i<tracks.length; i++){
      tracks.push("spotify:track:" + tracks[i].id);
    }
    var data2 = await this.spotifyApi.addTracksToPlaylist(this.playlist_id, ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
    console.log(data);
    var data3 = await this.spotifyApi.play({uri_context: uri});
    console.log(data3)
  }

  async componentDidMount() {
    this.socket = socketClient();

    this.socket.on('get_playlist', data => {
      this.createPlaylist(data);
    });

    const userData = await this.spotifyApi.getMe();
    this.dataObject.user_data = userData.body;

    const topTracks = await this.spotifyApi.getMyTopTracks();
    for (var i=0; i < topTracks.body.items.length; i++) {
      this.dataObject.top_tracks.push({
        name: topTracks.body.items[i].name,
        id: topTracks.body.items[i].id
      })
    }
    console.log(this.dataObject);

    const playLists = await this.spotifyApi.getUserPlaylists();
    for (var i=0; i < playLists.body.items.length; i++) {
      var name = playLists.body.items[i].name;
      var id = playLists.body.items[i].id;
      var json = {
        name: name,
        id: id,
        tracks: []
      }
      this.dataObject.playlists.push(json)
      let tracks = await this.spotifyApi.getPlaylistTracks(id)
      var temp = []
      for (var j=0; j < tracks.body.items.length; j++) {
        temp.push({
          name: tracks.body.items[j].track.name,
          id: tracks.body.items[j].track.id
        })
      }
      this.dataObject.playlists[i]["tracks"] = temp;
    }
    this.socket.emit('user_data', this.dataObject);
}
  render() {
    console.log(this.state);
    return (
      <div>
      <p>THIS IS THE ROOM </p>
      <Button onClick={() => this.generatePlayList()} color="primary" size="large">Generate</Button>
      </div>
    );
  }
}

export default Room;
