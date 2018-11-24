import express from 'express';
import path from 'path';
import config from './env-setup/config';
import bodyParser from 'body-parser';
import spotifyWebApi from 'spotify-web-api-node';

// APP
const app = express();

// SPOTIFY API HANDLER
const spotifyAPI = new spotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});


// MIDDLE WARE
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/** Setup to serve static content **/
app.use(express.static(path.join(__dirname, path.relative(__dirname, './../client/build'))));


//DEBUG Ping request
app.get('/ping', (req, res) => {
  res.status(200).send('PONG');
})


app.listen(config.app.port, () => {
  console.log(`App is running on port: ${config.app.port}`)
});
