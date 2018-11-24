import React, {Component} from 'react';
import queryString from 'query-string';
import Button from '../../components/spotifyButton/spotifyButton';
import UserComponent from '../../components/user-component/userComponent';
import socketClient from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';
import generateName from 'sillyname';
import img0 from '../../assets/albatross.svg';
import img1 from '../../assets/anteater.svg';
import img2 from '../../assets/baboon.svg';
import img3 from '../../assets/tuna.svg';
import img4 from '../../assets/turtle.svg';
import img5 from '../../assets/wasp.svg';
import img6 from '../../assets/wolf.svg';
import img7 from '../../assets/zander.svg';
import img8 from '../../assets/owl.svg';
import img9 from '../../assets/bear.svg';

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
      colors: ['#509BF5', '#57B560','#57B560','#F474A0', '#1D3264', '#FF4632','#F49B23'],
      images: [img1, img2, img3,img4,img5,img6,img7,img8,img9,img0,],
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
    let data3 = await this.spotifyApi.play({context_uri: uri, offset: {position: 0}});

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

    const playLists = await this.spotifyApi.getUserPlaylists();
    for (let i=0; i < playLists.body.items.length; i++) {
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  render() {
    return (
        <div className="room-screen">

            {this.state.userList.map((user, index) => {
              return <UserComponent name={user.name} key={index} index={index} 
              avatar={this.state.images[this.getRandomInt(0,this.state.images.length)]} color={this.state.colors[this.getRandomInt(0,this.state.colors.length)]}/>
            })}

            <Button onClick={() => this.generatePlayList()}>
            MASH PLAYLIST
            </Button>
        </div>
    );
  }
}

export default roomScreen;
