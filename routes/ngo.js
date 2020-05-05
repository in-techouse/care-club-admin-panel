var express = require("express");
var firebase = require("firebase");
var router = express.Router();

// Action Dashboard
router.get("/", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/index"); // render page
  } else {
    res.redirect("/");
  }
});

// Action All Products
router.get("/allproducts", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/allproducts"); // render page
  } else {
    res.redirect("/");
  }
});

// Action All Products
router.get("/myfunds", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myfunds"); // render page
  } else {
    res.redirect("/");
  }
});

// My profile
// Product detail
// Add payment
// My payment methods
// Add rider
// My riders

module.exports = router;
