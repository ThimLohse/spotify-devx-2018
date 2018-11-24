import React, {
  Component
} from 'react';
import queryString from 'query-string';
import {Button} from 'react-bulma-components/full';
import socketClient from 'socket.io-client';

class Room extends Component {

  constructor(props){
    super(props)
    this.state = {
      access_token: props.access_token,
      refresh_token: props.refresh_token
    }
    this.socket = null;
  }

  componentDidMount(){
    this.socket = socketClient();
    this.socket.emit('user_id', this.state);

  }


  render(){
    console.log(this.state);
    return (
      <div>
      THIS IS THE ROOM
      </div>
    );
  }
}

export default Room;
