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

// Action My Funds
router.get("/myfunds", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myfunds"); // render page
  } else {
    res.redirect("/");
  }
});
// Action My Profile
router.get("/myprofile", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myprofile"); // render page
  } else {
    res.redirect("/");
  }
});
// Action Product Detail
router.get("/productdetail", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/productdetail"); // render page
  } else {
    res.redirect("/");
  }
});
// Action Add Payment Method
router.get("/adPayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/adPayment"); // render page
  } else {
    res.redirect("/");
  }
});
// Action My Payment
router.get("/mypayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/mypayment"); // render page
  } else {
    res.redirect("/");
  }
});
// Action Add Rider
router.get("/addrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/addrider"); // render page
  } else {
    res.redirect("/");
  }
});
// Action My Rider
router.get("/myrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myrider"); // render page
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
