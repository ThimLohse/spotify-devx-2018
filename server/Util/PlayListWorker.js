export class User{
  constructor(socket_id, user_data, top_tracks, playlists) {
    this.user_data = user_data;
    this.socket_id = socket_id;
    this.top_tracks = top_tracks;
    this.playlists = playlists;
  }

  getCompiledUser(){
    return {
      id: this.socket_id,
      user_data: this.user_data,
      top_tracks: this.top_tracks
    }
  }
  getSocketID(){
    return this.socket_id;
  }
  getUser(){
    return this.user_data;
  }
  getTopSongs(){
    return this.top_tracks;
  }
}


export class UserHandler{
  constructor(){
    this.userList = {};
    this.trackList = {};
  }
  addUser(user){
    this.userList[user.id] = {...user};
    this.trackList[user.id] = this.randomSelector(user.top_tracks);

  }
  removeUser(socket_id){
    delete this.userList[socket_id];
    delete this.trackList[socket_id];
  }
  getUserList(){
    return this.userList;
  }
  randomSelector(tracks){
    let randomTracks = [];
    let randomLimit = 5;
    if(tracks.length < randomLimit){
      randomLimit = tracks.length;
    }
    for(let i = 0; i < randomLimit; i++){
      randomTracks.push(tracks[this.getRandomInt(0, tracks.length-1)]);
    }
    return randomTracks;

  }
  generatePlayList(socket_id){
    let tempList = {...this.trackList};
    for(let key in tempList){
      console.log(key);
    }
    return 'hello';
  }
  filterList(){

  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

}
