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
    this.playlist_image_url = null;
    this.dataObject = {
      user_data: {},
      top_tracks: [],
      playlists: [],
      metadata: {}
    };

    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(this.state.access_token);
  }


  generatePlayList(){
    this.socket.emit('generate_playlist');
  }

  async createPlaylist(tracks){
    let name = generateName();
    let id = this.dataObject.user_data.id;
    let data = await this.spotifyApi.createPlaylist(id, name, { 'public' : false })

    this.playlist_id = data.body.id;
    let uri = data.body.uri;

    let tracks_id = []
    for (let i = 0; i < tracks.length; i++){
      tracks_id.push("spotify:track:" + tracks[i].id);
    }

    let data2 = await this.spotifyApi.addTracksToPlaylist(this.playlist_id, tracks_id)
    let data_image = await fetch('https://api.spotify.com/v1/users/{user_id}/playlists/' + this.playlist_id + '/images', {
      method: 'get',
      headers: {
        "Authorization": "Bearer " + this.state.access_token
      }
    })
    this.playlist_image_url = data_image.url;
    console.log(this.playlist_image_url)
    this.addRecommandations(tracks);
    let data3 = await this.spotifyApi.play({context_uri: uri, offset: {position: 0}});
  }


  addRecommandations(tracks) {
    let _this = this;
    for (let i=0; i<10; i++) {
      var seeds = [];
      for (let j=0; j<5; j++) {
         seeds.push(tracks[Math.floor(Math.random()*tracks.length)].id);
      }
      this.spotifyApi.getRecommendations({ seed_tracks: seeds })
      .then(
        function(data) {
          _this.spotifyApi.addTracksToPlaylist(_this.playlist_id, ["spotify:track:" + data.body.tracks[0].id]);
        },
        function(err) {
          console.error(err);
        }
      );
    }
  }

  async componentDidMount() {
    this.socket = socketClient();

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

    var genre = []

    const topArtists = await this.spotifyApi.getMyTopArtists();
    for (var i=0; i < topArtists.body.items.length; i++) {
      genre = genre.concat(topArtists.body.items[i].genres)
    }

    var occurences = { };
    for (var i = 0; i < genre.length; i++) {
        if (typeof occurences[genre[i]] == "undefined") {
            occurences[genre[i]] = 1;
        } else {
            occurences[genre[i]]++;
        }
    }
    var items = Object.keys(occurences).map(function(key) {
      return [key, occurences[key]];
    });
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    this.dataObject.metadata = {
      top_track: this.dataObject.top_tracks[0].name,
      top_artist: topArtists.body.items[0].name,
      top_genres: items.slice(0, 3)
    }

    console.log(this.dataObject.metadata)

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
    this.socket.on('get_playlist', playList => {
        console.log(playList);
        this.createPlaylist(playList);
    })

}

  render() {

    return (
      <div>
      <p>THIS IS THE ROOM </p>
      <Button onClick={() => this.generatePlayList()} color="primary" size="large">Generate</Button>
      </div>
    );
  }
}

export default Room;
