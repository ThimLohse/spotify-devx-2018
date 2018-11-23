import config from './env_setup/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';

const app = express();

// MIDDLE WARE //
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.use(express.static(path.join(__dirname, path.relative(__dirname, '../client/build')))); //use for hosting the build version of the application
app.get('/ping', (req, res) => {
  res.send('<h1>pong pong</h1>');
})

app.listen(config.app.port, () => {
  console.log(`App is running on port: ${config.app.port}`)
});
