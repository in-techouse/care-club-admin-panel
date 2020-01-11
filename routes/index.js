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
router.get('/', function (req, res) {
  res.render('pages/login', { error: "" });
});


router.post('/signin', function (req, res) {
  firebase.auth().signInWithEmailAndPassword(req.body.userEmail, req.body.userPassword).then(are => {

    var id = userEmail.replace("@", "-");
    id = id.replace(/\./g, "_");
    firebase.database().ref().child("NGOS").child(id).once('value').then(data => {

      if (data === null || data === undefined || data.val() === null || data.val() ===) {
        res.render('pages/login', { error: "You are not authorized to login here" });
      }
      else {
        req.session.id=data.val().id;
        req.session.name=data.val().name;
        req.session.email=req.body.userEmail;
        res.json("1");
      }
    }
    }).catch(err => {

      res.render('pages/login', { error: "You are not authorized to login here" })

    });


}).catch(e => {

  res.render('pages/login', { error: e.message })

});
  
});

module.exports = router;
