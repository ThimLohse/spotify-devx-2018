export class User {
  constructor(socket_id, user_data, top_tracks, playlists) {
    this.user_data = user_data;
    this.socket_id = socket_id;
    this.top_tracks = top_tracks;
    this.playlists = playlists;
  }

  getCompiledUser() {
    return {
      id: this.socket_id,
      user_data: this.user_data,
      top_tracks: this.top_tracks
    }
  }
  getSocketID() {
    return this.socket_id;
  }
  getUser() {
    return this.user_data;
  }
  getTopSongs() {
    return this.top_tracks;
  }
}


export class UserHandler {
  constructor() {
    this.userList = {};
    this.trackList = {};
  }
  addUser(user) {
    this.userList[user.id] = { ...user};
    this.trackList[user.id] = this.randomSelector(user.top_tracks);

  }
  removeUser(socket_id) {
    delete this.userList[socket_id];
    delete this.trackList[socket_id];
  }
  getUserList() {
    return this.userList;
  }
  getFrontendUserList(){
    let tempList = {...this.userList};
    let tiny_list = [];
    for(let key in tempList){
      tiny_list.push(
        {
          name: (tempList[key].user_data.display_name == null || tempList[key].user_data.display_name.length == 25 ? 'Stranger Danger' : tempList[key].user_data.display_name),
          id: key
        })
    }
    return tiny_list;

  }
  randomSelector(tracks) {
    let randomTracks = [];
    let randomLimit = 5;
    if (tracks.length < randomLimit) {
      randomLimit = tracks.length;
    }
    for (let i = 0; i < randomLimit; i++) {
      randomTracks.push(tracks[this.getRandomInt(0, tracks.length - 1)]);
    }
    return randomTracks;

  }
  generatePlayList(socket_id) {
    let tempList = { ...this.trackList
    };
    let returnList = [];
    for (let key in tempList) {
      tempList[key].forEach((track) => {
        returnList.push(track);
      })
    }
    //TODO Reduce list here ??
    returnList = this.reduceList(this.shuffle(this.filterList(returnList)));
    return returnList;
  }
  filterList(unfiltered_list) {
    const result = [];
    const map = new Map();
    for (const item of unfiltered_list) {
      if (!map.has(item.id)) {
        map.set(item.id, true); // set any value to Map
        result.push({
          id: item.id,
          name: item.name
        });
      }
    }
    return result;
  }
  reduceList(big_list){
    let tempList = [...big_list];
    if(big_list.length > 100){
      for(let i = 100; i < 0; i--){
        tempList.splice(Math.floor(Math.random()*tempList.length), 1);
      }
      return tempList;
    }
    else{
      return tempList;
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

}
