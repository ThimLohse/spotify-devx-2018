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
      copy: false,
      generatedPlaylist: false,
    }

    this.global_top5 = [];
    this.global_uri = '';
    this.global_name = '';
    this.global_image_url = '';
    this.socket = socketClient();
    this.playlist_id = null;
    this.dataObject = {
      user_data: {},
      top_tracks: [],
      playlists: [],
      metadata: {}
    };

    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(this.state.access_token);
  }

  // MODAL FUNCTIONS
  open = () => this.setState({ showModal: true });
  close = () => this.setState({ showModal: false });

  generatePlayList(){
    this.socket.emit('generate_playlist');
    this.setState({ generatedPlaylist: true })
  }

  async createPlaylist(tracks){
    this.global_top5 = [];
    this.state["shareContent"] = 'Get a link to share ❤️';
    this.state["copy"] = false;

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
      if (i < 5) {
        this.global_top5.push(<li>{tracks[i].name}</li>)
      }
    }
    this.global_top5.push(<li>{"..."}</li>)

    let data2 = await this.spotifyApi.addTracksToPlaylist(this.playlist_id, tracks_id)
    let data_image = await fetch('https://api.spotify.com/v1/users/{user_id}/playlists/' + this.playlist_id + '/images', {
      method: 'get',
      headers: {
        "Authorization": "Bearer " + this.state.access_token
      }
    })


    data_image.json().then((data) => {
      try {
        this.global_image_url = data[0].url;
      } catch {
        console.log("image_error")
      }
      this.open();
    })

    this.addRecommandations(tracks);

    let data3 = await this.spotifyApi.play({context_uri: uri, offset: {position: 0}});

  }
  addRecommandations(tracks) {
    let _this = this;
    var tracks_recommended = [];
    for (let i = 0; i < 10; i++) {
      var seeds = [];
      for (let j = 0; j < 5; j++) {
         seeds.push(tracks[Math.floor(Math.random()*tracks.length)].id);
      }
      this.spotifyApi.getRecommendations({ seed_tracks: seeds, limit:1, country: "SE" })
      .then(
        function(data) {
          tracks_recommended.push("spotify:track:" + data.body.tracks[0].id)
          if (tracks_recommended.length == 10) {
            _this.spotifyApi.addTracksToPlaylist(_this.playlist_id, tracks_recommended);
          }
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

    try {
      this.dataObject.metadata = {
        top_track: this.dataObject.top_tracks[0].name,
        top_artist: topArtists.body.items[0].name,
        top_genres: items.slice(0, 3)
      }
    } catch {
      try {
        this.dataObject.metadata = {
          top_track: this.dataObject.top_tracks[0].name,
          top_artist: [],
          top_genres: items.slice(0, 3)
        }
      } catch {
        try {
          this.dataObject.metadata = {
            top_track: [],
            top_artist: [],
            top_genres: items.slice(0, 3)
          }
        } catch {

          this.dataObject.metadata = {
            top_track: [],
            top_artist: [],
            top_genres: []
          }

        }
      }
    }



    console.log(this.dataObject.metadata)
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

  render() {
    let userSize = window.innerHeight/Math.ceil(this.state.userList.length/10)*.1;

    const saveLink = this.state.copy;
    let shareContext;

    if (!saveLink) {
      shareContext = <Button style={{backgroundColor: '#e0e0eb'}} onClick={() => this.playListLinkHandler()}>{this.state.shareContent}</Button>;
    } else {
      shareContext = <p>{this.state.shareContent}</p>;
    }

    let users = null;
    users = (
      <div>
        {this.state.userList.map((user, index) => {
          return <UserComponent user={user} name={user.name} key={user.id} index={index}
            avatar={this.state.images[index]} color={this.state.colors[index]} generatedPlaylist={false}
          size={userSize}/>
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
                <Image renderas="p" size={128} alt="128x128" src={this.global_image_url}/>
              </Media.Item>
              <Media.Item>
                <Content >
                  <p>
                    <strong>{this.global_name}</strong>
                  </p>
                  <ul>{this.global_top5}</ul>
                </Content>

              </Media.Item>
            </Media>
            <br />
            <Level breakpoint="mobile" style={{ alignItems: 'center', justifyContent: 'center'}}>
              {shareContext}
            </Level>
          </Modal.Card.Body>
          <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2e6ff' }}>
            <p>Head over to your Spotify app to see your new playlist!</p>
          </Modal.Card.Foot>
        </Modal.Card>
        </Modal>
            {users}
            <SpotifyButton onClick={() => this.generatePlayList()}>
            MASH MUSIC
            </SpotifyButton>
        </div>
    );
  }
}

export default roomScreen;
