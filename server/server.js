import config from './../env-setup/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();


// MIDDLE WARE //
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//app.use(express.static()) //use for hosting the build version of the application
app.get('/', (req, res) => {
  res.send('Hello From The Server');
})



app.listen(config.app.port, () => {console.log(`Backend listening to port: ${config.app.port}`)});
