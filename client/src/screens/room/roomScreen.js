import React, {Component} from 'react';
import queryString from 'query-string';
import Button from '../../components/spotifyButton/spotifyButton';
import UserComponent from '../../components/user-component/userComponent';
import socketClient from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';
import generateName from 'sillyname';
import style from './index.css';
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
      userList: [],
      colors: ['#509BF5', '#57B560','#57B560','#F474A0', '#1D3264', '#FF4632','#F49B23'],
      images: [img1, img2, img3,img4,img5,img6,img7,img8,img9,img0,],
    }

    this.socket = socketClient();
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
/*
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
    */
    this.socket.emit('user_data', this.dataObject);
    this.socket.on('get_playlist', playList => {
        console.log(playList);
        this.createPlaylist(playList);
    })

    this.socket.on('user_list_changed', (new_list) => {
      let tempList = [...new_list];
      this.setState({userList: [...tempList]});
      console.log(new_list);
    })
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  //this.getRandomInt(0,this.state.images.length)

  render() {

    let users = null;
    users = (
      <div>
      {this.state.userList.map((user, index) => {
        return <UserComponent name={user.name} key={user.id} index={index}
        avatar={this.state.images[index]} color={this.state.colors[index]}/>
      })}
      </div>
    );
    return (
        <div className="room-screen">
            {users}
            <Button onClick={() => this.generatePlayList()}>
            MASH PLAYLIST
            </Button>
        </div>
    );
  }
}

export default roomScreen;
