import React, { Component } from 'react';
import UserComponent from '../../components/user-component/userComponent.js';
import style from './index.css';

class roomScreen extends Component {
  
  render() {
    return (
        <div className="room-screen">
          <UserComponent/>
        </div>
    );
  }
}

export default roomScreen;
