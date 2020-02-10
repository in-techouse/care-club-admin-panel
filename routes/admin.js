var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/index");
  } else {
    res.redirect("/");
  }
});
router.get("/allngos", function(req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/allngos");
  } else {
    res.redirect("/");
  }
});
router.get("/alluser", function(req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/alluser");
  } else {
    res.redirect("/");
  }
});
router.get("/ngosdetail", function(req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/ngosdetail");
  } else {
    res.redirect("/");
  }
});
router.get("/userdetail", function(req, res) {
  if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/userdetail");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
