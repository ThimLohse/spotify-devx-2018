import express from 'express';
import path from 'path';
import config from './env-setup/config';
import bodyParser from 'body-parser';
import spotifyWebApi from 'spotify-web-api-node';
import IO from 'socket.io';
import http from 'http';

const scopes = ['user-top-read'];


// APP
const app = express();
const server = http.Server(app);

// SPOTIFY API HANDLER
const spotifyAPI = new spotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// MIDDLE WARE
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/** Setup to serve static content **/
//app.use(express.static(path.join(__dirname, path.relative(__dirname, './../client/build'))));


app.get('/login', (req, res) => {
  let authorizeURL = spotifyAPI.createAuthorizeURL(scopes, null, true);
  console.log(authorizeURL);
  res.status(200).send({url: authorizeURL});
})

app.get('/callback', (req, res) => {
  let authCode = req.query.code;
  console.log(authCode);

  spotifyAPI.authorizationCodeGrant(authCode)
  .then((data) => {
    console.log(`Data: ${data}`);
    res.redirect(`${process.env.CLIENT_REDIRECT}/#access_token=${data.body['access_token']}&refresh_token=${data.body['refresh_token']}`)
  })
  .catch((err) => console.log('Something went wrong!! OH NOO!'));
})


app.get('/', (req, res) => {
  res.send('Home');
})

//DEBUG Ping request
app.get('/ping', (req, res) => {
  res.status(200).send('PONG');
})



server.listen(config.app.port, () => {
  console.log(`App is running on port: ${config.app.port}`)
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
      process.exit()
    };
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
