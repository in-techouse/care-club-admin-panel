var express = require('express');
var router = express.Router();

var firebase = require('firebase');
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID

  
};
firebase.initializeApp(firebaseConfig);
/* GET home page. */
router.get('/', function(req, res) {
  res.render('pages/login', {error: ""});
});


router.post('/signin', function(req, res) {
  res.json("1");
});

module.exports = router;
