import React, {Component} from 'react';
import queryString from 'query-string';
import SpotifyButton from '../../components/spotifyButton/spotifyButton';
import UserComponent from '../../components/user-component/userComponent';
import socketClient from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';
import generateName from 'sillyname';
import style from './index.css';
import { Modal, Content, Image, Media, Level, Button } from 'react-bulma-components/full';
const reqSvgs = require.context( './../../assets', true, /\.svg$/ )
const paths = reqSvgs.keys()
const svgs = paths.map( path => reqSvgs ( path ) )


class roomScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token,
      userList: [],
      colors: ['#509BF5', '#57B560','#57B560','#F474A0', '#1D3264', '#FF4632','#F49B23'],
      images: svgs,
      showModal: false,
      shareContent: 'Get a link to share ❤️',
      copy: false
    }

    this.global_uri = '';
    this.global_name = '';
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

  // MODAL FUNCTIONS
  open = () => this.setState({ showModal: true });
  close = () => this.setState({ showModal: false });

  generatePlayList(){
    this.socket.emit('generate_playlist');
  }

  async createPlaylist(tracks){
    let name = generateName();
    this.global_name = name;
    let id = this.dataObject.user_data.id;
    let data = await this.spotifyApi.createPlaylist(id, name, { 'public' : false })

    this.playlist_id = data.body.id;
    let uri = data.body.uri;
    this.global_uri = uri;

    let tracks_id = []
    for (let i = 0; i < tracks.length; i++){
      tracks_id.push("spotify:track:" + tracks[i].id);
    }

    let data2 = await this.spotifyApi.addTracksToPlaylist(this.playlist_id, tracks_id)
    this.addRecommandations(tracks);
    this.open();

    let data3 = await this.spotifyApi.play({context_uri: uri, offset: {position: 0}});

  }
  addRecommandations(tracks) {
    let _this = this;
    for (let i = 0; i < 10; i++) {
      var seeds = [];
      for (let j = 0; j < 5; j++) {
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

  playListLinkHandler = () => {
    if(this.state.copy === false){
      let shareLink = this.global_uri;
      this.setState({shareContent: shareLink, copy: true});
    }
    else{

    }

  }


  //this.getRandomInt(0,this.state.images.length)

  render() {

    const saveLink = this.state.copy;
    let shareContext;

    if (!saveLink) {
      shareContext = <Button style={{backgroundColor: '#e0e0eb'}}onClick={() => this.playListLinkHandler()}>{this.state.shareContent}</Button>;
    } else {
      shareContext = <p>{this.state.shareContent}</p>;
    }
    let users = null;
    users = (
      <div>
      {this.state.userList.map((user, index) => {
        return <UserComponent name={user.name} key={user.id} index={index}
        avatar={this.state.images[index]} color={this.state.colors[index]}/>
      })}
      </div>
    );
    const style = {
      'backgroundColor': '#f2e6ff'
    }
    return (
        <div className="room-screen">
        <Modal show={this.state.showModal} onClose={this.close} closeOnBlur={this.close}>
        <Modal.Card>
          <Modal.Card.Head style={style} onClick={this.close}>
            <Modal.Card.Title>Yeey! This is your new amazing playlist</Modal.Card.Title>
          </Modal.Card.Head>
          <Modal.Card.Body style={style}>
            <Media>
              <Media.Item renderas="figure" position="left">
                <Image renderas="p" size={64} alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
              </Media.Item>
              <Media.Item>
                <Content >
                  <p>
                    <strong>{this.global_name}</strong>
                    <br />
                    A list of songs here maybe?
                  </p>
                </Content>
                <Level breakpoint="mobile">
                  <Level.Side align="left">
                  {shareContext}
                  </Level.Side>
                </Level>
              </Media.Item>
            </Media>
          </Modal.Card.Body>
          <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2e6ff' }}>
            <p>Additonal Info</p>
          </Modal.Card.Foot>
        </Modal.Card>
        </Modal>
            {users}
            <SpotifyButton onClick={() => this.generatePlayList()}>
            MASH PLAYLIST
            </SpotifyButton>
        </div>
    );
  }
}

export default roomScreen;
