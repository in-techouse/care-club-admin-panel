var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('pages/login', {error: ""});
});


router.post('/signin', function(req, res) {
  res.json("1");
});

module.exports = router;
