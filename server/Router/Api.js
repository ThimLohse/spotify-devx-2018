import express from 'express';
const router = express.Router()

// define the home page route
router.get('/user_info', (req, res) =>  {

  res.send('user info')
})
// define the about route
router.get('/song_info', (req, res) => {
  res.send('song info')
})

module.exports = router;
