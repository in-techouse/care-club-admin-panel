var express = require("express");
var router = express.Router();

var firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get("/", function(req, res) {
  res.render("pages/login", { error: "" });
});

router.post("/signin", function(req, res) {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.userEmail, req.body.userPassword)
    .then(are => {
      var id = req.body.userEmail.replace("@", "-");
      id = id.replace(/\./g, "_");
      firebase
        .database()
        .ref()
        .child("NGOS")
        .child(id)
        .once("value")
        .then(data => {
          if (
            data === null ||
            data === undefined ||
            data.val() === null ||
            data.val() === undefined
          ) {
            firebase
              .database()
              .ref()
              .child("Admins")
              .child(id)
              .once("value")
              .then(admin => {
                if (
                  data === null ||
                  data === undefined ||
                  data.val() === null ||
                  data.val() === undefined
                ) {
                  req.session.id = admin.val().id;
                  req.session.email = admin.val().email;
                  req.session.name = admin.val().name;
                  req.session.isAdmin = true;
                  res.redirect("/admin");
                } else {
                  res.render("pages/login", {
                    error: "You are not authorized to login here"
                  });
                }
              });
          } else {
            req.session.category = data.val().category;
            req.session.name = data.val().name;
            req.session.email = data.val().email;
            req.session.phone = data.val().phone;
            req.session.address = data.val().address;
            req.session.id = data.val().id;
            req.session.isNGO = true;
            res.redirect("/ngo");
          }
        })
        .catch(err => {
          res.render("pages/login", {
            error: "You are not authorized to login here"
          });
        });
    })
    .catch(e => {
      res.render("pages/login", { error: e.message });
    });
});
router.get("/registeration", function(req, res) {
  res.render("pages/registration", { error: "" });
});
router.post("/registeration", function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let passwordConfirmation = req.body.passwordConfirmation;
  var id = req.body.email.replace("@", "-");
  id = id.replace(/\./g, "_");
  let ngo = {
    category: req.body.ngoCategory,
    name: req.body.ngoName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    id: id,
    images: [],
    paymentMethods: []
  };
  if (password === passwordConfirmation) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(n => {
        firebase
          .database()
          .ref()
          .child("NGOS")
          .child(ngo.id)
          .set(ngo)
          .then(r => {
            req.session.category = ngo.category;
            req.session.name = ngo.name;
            req.session.email = ngo.email;
            req.session.phone = ngo.phone;
            req.session.address = ngo.address;
            req.session.id = ngo.id;
            req.session.isNGO = true;
            res.redirect("/ngo");
          });
      })
      .catch(e => {
        res.render("pages/registration", { error: e.message });
      });
  } else {
    res.render("pages/registration", { error: "Password doesn't match" });
  }
});
module.exports = router;
