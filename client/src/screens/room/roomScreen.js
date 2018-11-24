import React, { Component } from 'react';
import UserComponent from '../../components/user-component/userComponent.js';
import SpotifyButton from '../../components/spotifyButton/spotifyButton.js';
import style from './index.css';
import socketClient from 'socket.io-client';
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
      images: [img1, img2, img3,img4,img5,img6,img7,img8,img9,img0,],
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  render() {
    return (
        <div className="room-screen">

            {this.state.userList.map((user, index) => {
              return <UserComponent name={user.name} key={index} index={index} avatar={this.state.images[this.getRandomInt(0,this.state.images.length)]}/>
            })}

            <SpotifyButton onClick={this.generatePlaylist()}>
            MASH PLAYLIST
            </SpotifyButton>
        </div>
    );
  }
}

export default roomScreen;
