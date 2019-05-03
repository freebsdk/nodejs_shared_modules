var express = require('express');
var router = express.Router();




// Home page route
router.get('/', (req, res) => {
  res.status(200).send('Wiki home page');
})





// About page route
router.get('/about', (req, res) => {
  res.status(200).send('About this wiki');
})




module.exports = {
    router : router
}