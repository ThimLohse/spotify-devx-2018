import express from 'express';
import path from 'path';
import config from './env-setup/config';
import bodyParser from 'body-parser';
import spotifyWebApi from 'spotify-web-api-node';

const scopes = ['user-top-read'];


// APP
const app = express();

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


app.listen(config.app.port, () => {
  console.log(`App is running on port: ${config.app.port}`)
});
