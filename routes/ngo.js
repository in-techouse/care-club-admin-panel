var express = require("express");
var firebase = require("firebase");
var router = express.Router();

// Action Dashboard
router.get("/", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/index", { ngo: req.session, action: "dashboard" });
  } else {
    res.redirect("/");
  }
});

// Action All Products
router.get("/allproducts", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    let products = [];
    firebase
      .database()
      .ref()
      .child("Products")
      .orderByChild("taken") // ngoid
      .equalTo(false) // req.session.id
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          products.push(d.val());
        });
        res.render("pages/ngos/allproducts", {
          ngo: req.session,
          products: products,
          action: "allproducts",
        });
      })
      .catch((e) => {
        res.render("pages/ngos/allproducts", {
          ngo: req.session,
          products: products,
          action: "allproducts",
        });
      });
  } else {
    res.redirect("/");
  }
});

// Action My Funds
router.get("/myfunds", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myfunds", { ngo: req.session, action: "myfunds" }); // render page
  } else {
    res.redirect("/");
  }
});

// Action My Profile
router.get("/myprofile", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myprofile", {
      ngo: req.session,
      action: "myprofile",
    }); // render page
  } else {
    res.redirect("/");
  }
});

// Action Product Detail
router.get("/productdetail", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/productdetail", {
      ngo: req.session,
      action: "productdetail",
    }); // render page
  } else {
    res.redirect("/");
  }
});

// Action Add Payment Method
router.get("/adPayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/adPayment", {
      ngo: req.session,
      action: "adPayment",
    }); // render page
  } else {
    res.redirect("/");
  }
});

router.post("/adPayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/adPayment", {
      ngo: req.session,
      action: "adPayment",
    }); // render page
  } else {
    res.redirect("/");
  }
});

// Action My Payment
router.get("/mypayment", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/mypayment", {
      ngo: req.session,
      action: "myPayment",
    }); // render page
  } else {
    res.redirect("/");
  }
});

// Action Add Rider
router.get("/addrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/addrider", { ngo: req.session, action: "addrider" }); // render page
  } else {
    res.redirect("/");
  }
});

router.post("/addrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/addrider", { ngo: req.session, action: "addrider" }); // render page
  } else {
    res.redirect("/");
  }
});

// Action My Rider
router.get("/myrider", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myrider", { ngo: req.session, action: "myrider" }); // render page
  } else {
    res.redirect("/");
  }
});

// Action My Products
router.get("/myProducts", function (req, res) {
  if (req.session.isNGO && req.session.isNGO === true) {
    res.render("pages/ngos/myProducts", {
      ngo: req.session,
      action: "myProducts",
    }); // render page
  } else {
    res.redirect("/");
  }
});

module.exports = router;
