var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function (req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/index", { action: "dashboard" });
  } else {
    res.redirect("/");
  }
});

router.get("/allngos", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  let ngos = [];
  firebase
    .database()
    .ref()
    .child("NGOS")
    .orderByKey()
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        ngos.push(d.val());
      });
      res.render("pages/admin/allngos", { ngos: ngos, action: "allngos" });
    })
    .catch((e) => {
      res.render("pages/admin/allngos", { ngos: ngos, action: "allngos" });
    });
  // } else {
  //   res.redirect("/");
  // }
});

router.get("/alluser", function (req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
  let users = [];
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("role")
    .equalTo(0)
    .once("value")
    .then((data) => {
      data.forEach((u) => {
        users.push(u.val());
      });
      res.render("pages/admin/alluser", { users: users, action: "alluser" });
    })
    .catch((e) => {
      res.render("pages/admin/alluser", { users: users, action: "alluser" });
    });
  // } else {
  //   res.redirect("/");
  // }
});

router.get("/ngosdetail", function (req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/ngosdetail");
  } else {
    res.redirect("/");
  }
});

router.get("/userdetail", function (req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/userdetail");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
