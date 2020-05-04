var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.json(req.session);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
