export class User{
  constructor(socket_id, access_token, refresh_token, top_tracks) {
    this.socket_id = socket_id;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.top_tracks = top_tracks;
  }

  getCompiledUser(){
    return {
      id: this.socket_id,
      access_token: this.access_token,
      refresh_token: this.refresh_token,
      top_tracks: this.top_tracks
    }
  }
  getSocketID(){
    return this.socket_id;
  }
  getAccessToken(){
    return this.access_token;
  }
  getRefreshToken(){
    return this.refresh_token;
  }
  getTopSongs(){
    return this.top_tracks;
  }
}


export class UserHandler{
  constructor(){
    this.userList = {};
  }
  addUser(user){
    this.userList[user.id] = {...user};
  }
  removeUser(socket_id){
    delete this.userList[socket_id];
  }
  getUserList(){
    return this.userList;
  }

}
